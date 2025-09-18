import axios from 'axios';
import { PetDataMap, PetInfo, UserPetInfo } from '../types/petexchange';
import { URL_CONFIG } from '../types/urlconfig';
import { getFromCache, saveToCache } from './file-cache';
import { fetchJavaScriptFile } from './gamedataparser';
import { getPetDataMap, savePetDataMap, smartSaveUserPetInfos } from './user-pet-database';

// 宠物数据缓存
const petDataCache: Record<string, PetInfo> = {};

/**
 * 初始化宠物数据模块
 */
export async function initPetDataModule(): Promise<boolean> {
  try {
    // 首先尝试从数据库获取宠物数据字典
    const dbPetDataMap = await getPetDataMap();

    if (Object.keys(dbPetDataMap).length > 0) {
      Object.assign(petDataCache, dbPetDataMap);
      return true;
    }

    // 如果数据库中没有，尝试从文件缓存获取
    const cachedData = await getFromCache<PetDataMap>(URL_CONFIG.yabiJs);

    if (cachedData) {
      Object.assign(petDataCache, cachedData);
      // 保存到数据库
      await savePetDataMap(cachedData);
      return true;
    }

    // 如果都没有，从网络获取
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.yabiJs);
    const petDataMap = extractYabiData(jsContent);

    // 保存到文件缓存、数据库和内存
    await saveToCache(URL_CONFIG.yabiJs, petDataMap);
    await savePetDataMap(petDataMap);
    Object.assign(petDataCache, petDataMap);

    console.warn(`从网络获取了 ${Object.keys(petDataMap).length} 个宠物数据并保存到缓存和数据库`);

    return true;
  } catch (error) {
    console.error('初始化宠物数据时出错:', error);
    return false;
  }
}

/**
 * 确保宠物数据字典已保存到数据库
 * 这个函数应该在宠物数据加载后调用，确保数据持久化
 */
export async function ensurePetDataMapSaved(): Promise<void> {
  try {
    // 检查数据库中是否已有 petDataMap
    const dbPetDataMap = await getPetDataMap();

    if (Object.keys(dbPetDataMap).length === 0 && Object.keys(petDataCache).length > 0) {
      // 如果数据库中没有但内存中有，则保存到数据库
      await savePetDataMap(petDataCache);
    }
  } catch (error) {
    console.error('确保宠物数据字典保存时出错:', error);
  }
}

/**
 * 从yabi.js文件中提取_YABI对象
 * @param jsContent - JavaScript文件内容
 * @returns 解析后的宠物数据映射
 */
function extractYabiData(jsContent: string): PetDataMap {
  const regex = /var _YABI = (\{[\s\S]*?\})\s*(?:;|$)/;
  const match = jsContent.match(regex);

  if (match && match[1]) {
    try {
      let yabiJson = match[1];

      // 将JavaScript对象转换为JSON格式
      // 1. 移除注释
      yabiJson = yabiJson.replace(/\/\/.*$/gm, '');
      // 2. 将键名添加双引号 - 匹配数字键名
      yabiJson = yabiJson.replace(/(\s*)(\d+)(\s*):/g, '$1"$2"$3:');
      // 3. 将内部对象的键名也添加双引号
      yabiJson = yabiJson.replace(/(\s*)(name|type)(\s*):/g, '$1"$2"$3:');
      // 4. 移除空行
      yabiJson = yabiJson.replace(/\n\s*\n/g, '\n');
      // 5. 移除尾随逗号（如果有）
      yabiJson = yabiJson.replace(/,(\s*[}\]])/g, '$1');

      return JSON.parse(yabiJson);
    } catch (error) {
      console.error('解析YABI数据时出错:', error);
      throw new Error('无法解析YABI数据');
    }
  }

  throw new Error('在JS内容中未找到_YABI对象');
}

/**
 * 获取所有已缓存宠物的简要列表
 * @returns {{ id: string; name: string }[]} 包含宠物ID和名称的对象数组
 */
export function getAllPets(): { id: string; name: string }[] {
  return Object.values(petDataCache).map((pet) => ({
    id: pet.id,
    name: pet.name,
  }));
}

/**
 * 根据ID获取单个宠物的完整信息
 * @param {string} id - 宠物的ID
 * @returns {PetInfo | null} 对应的宠物对象，如果未找到则返回null
 */
export function getPetById(id: string): PetInfo | null {
  return petDataCache[id] || null;
}

/**
 * 批量获取宠物信息
 * @param petIds - 宠物ID数组
 * @returns 宠物信息数组
 */
export function getPetInfos(petIds: string[]): PetInfo[] {
  return petIds.map((petId) => {
    const petInfo = petDataCache[petId];

    if (petInfo) {
      return petInfo;
    } else {
      return {
        id: petId,
        name: `未知宠物(${petId})`,
        type: 'unknown' as const,
      };
    }
  });
}

/**
 * 批量查询用户宠物信息（简单分批查询策略）
 * @param userIdList - 用户ID列表
 * @returns 查询结果数组
 */
export async function batchQueryUserPets(userIdList: string[]) {
  // 首先对用户ID进行去重
  const uniqueUserIds = [...new Set(userIdList)];

  const allResults: any[] = [];
  const networkQueryIds: string[] = [];

  // 第一步：先从数据库查询已有数据
  const databaseResults: any[] = [];

  const databasePromises = uniqueUserIds.map(async (userid) => {
    try {
      const { getUserPetInfo } = await import('./user-pet-database');
      const userPetInfo = await getUserPetInfo(userid);
      if (userPetInfo && userPetInfo.success && userPetInfo.rawData) {
        // 检查是否有宠物数据
        if (!userPetInfo.rawData.pmr || userPetInfo.rawData.pmr.trim() === '') {
          return {
            userid: userPetInfo.userid,
            userName: userPetInfo.userName,
            success: false,
            rawData: userPetInfo.rawData,
            lastUpdated: userPetInfo.lastUpdated,
            source: 'database',
          };
        }

        // 转换为前端需要的格式
        const formattedUser: any = {
          userid: userPetInfo.userid,
          userName: userPetInfo.userName,
          success: true,
          rawData: userPetInfo.rawData,
          lastUpdated: userPetInfo.lastUpdated,
          source: 'database',
        };

        // 从 rawData 中提取宠物ID和信息
        const petIds = extractPetIdsFromApiResponse(userPetInfo.rawData);
        const petInfos = getPetInfos(petIds);
        formattedUser.petIds = petIds;
        formattedUser.petInfos = petInfos;

        return formattedUser;
      } else {
        // 数据库中没有或数据无效，加入网络查询列表
        networkQueryIds.push(userid);
        return null;
      }
    } catch (error) {
      // 使用 error 参数记录错误信息
      console.error('数据库查询失败:', error);
      // 数据库查询失败，加入网络查询列表
      networkQueryIds.push(userid);
      return null;
    }
  });

  // 等待数据库查询完成
  const databaseQueryResults = await Promise.allSettled(databasePromises);
  databaseQueryResults.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      databaseResults.push(result.value);
    }
  });

  allResults.push(...databaseResults);

  // 第二步：对数据库中没有的用户进行网络查询（分批处理）
  if (networkQueryIds.length > 0) {
    // 分批处理网络查询，每批50个用户
    const batchSize = 50;

    for (let i = 0; i < networkQueryIds.length; i += batchSize) {
      const batch = networkQueryIds.slice(i, i + batchSize);

      const batchPromises = batch.map(async (userid) => {
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
          try {
            const apiUrl = `${URL_CONFIG.api.userService}?otherid=${userid}&userid=0&token=&_=${Date.now()}`;
            const refererUrl = `${URL_CONFIG.api.friendPage}?userid=${userid}`;

            const apiResponse = await axios.get(apiUrl, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept:
                  'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                Referer: refererUrl,
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
                'Sec-Fetch-Dest': 'script',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'same-origin',
                Connection: 'keep-alive',
              },
              timeout: 15000,
            });

            let jsonData;
            if (typeof apiResponse.data === 'string') {
              const jsonMatch = apiResponse.data.match(/\((.*)\)/);
              if (jsonMatch) {
                jsonData = JSON.parse(jsonMatch[1]);
              } else {
                jsonData = JSON.parse(apiResponse.data);
              }
            } else {
              jsonData = apiResponse.data;
            }

            if (jsonData.code === 0) {
              const { data } = jsonData;

              if (!data.pmr || data.pmr.trim() === '') {
                return {
                  userid: userid,
                  userName: data.nn || data.uname || data.nickname || data.name || `用户${userid}`,
                  success: false,
                  error: '用户没有宠物数据',
                  rawData: data,
                  lastUpdated: new Date().toISOString(),
                  source: 'network',
                };
              }

              const userName =
                data.nn || data.uname || data.nickname || data.name || `用户${userid}`;

              const formattedUser: any = {
                userid: userid,
                userName: userName,
                success: true,
                rawData: data,
                lastUpdated: new Date().toISOString(),
                source: 'network',
              };

              const petIds = extractPetIdsFromApiResponse(data);
              const petInfos = getPetInfos(petIds);
              formattedUser.petIds = petIds;
              formattedUser.petInfos = petInfos;

              return formattedUser;
            } else {
              // API返回错误，准备重试
              retries++;
              if (retries < maxRetries) {
                const retryDelay = 1000 * retries + Math.random() * 1000; // 递增延迟 + 随机性
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
                continue;
              }

              return {
                userid: userid,
                userName: `用户${userid}`,
                success: false,
                error: `API request failed after ${maxRetries} retries`,
                apiResponse: jsonData,
                lastUpdated: new Date().toISOString(),
                source: 'network',
              };
            }
          } catch (error) {
            retries++;
            if (retries < maxRetries) {
              const retryDelay = 1000 * retries + Math.random() * 1000; // 递增延迟 + 随机性
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              continue;
            }

            return {
              userid: userid,
              userName: `用户${userid}`,
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : `Unknown error after ${maxRetries} retries`,
              lastUpdated: new Date().toISOString(),
              source: 'network',
            };
          }
        }

        // 如果所有重试都失败，返回错误结果
        return {
          userid: userid,
          userName: `用户${userid}`,
          success: false,
          error: `All ${maxRetries} retry attempts failed`,
          lastUpdated: new Date().toISOString(),
          source: 'network',
        };
      });

      const batchResults = await Promise.allSettled(batchPromises);
      const validBatchResults = batchResults
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === 'fulfilled' && result.value !== null
        )
        .map((result) => result.value);

      allResults.push(...validBatchResults);

      // 批次之间添加延迟 - 增加延迟时间并添加随机性以避免API限制
      if (i + batchSize < networkQueryIds.length) {
        const delay = 300 + Math.random() * 200; // 300-500ms随机延迟
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // 第三步：保存网络查询的成功数据到数据库
  const successfulNetworkResults = allResults.filter(
    (result) =>
      result.success && result.source === 'network' && result.petIds && result.petIds.length > 0
  );

  if (successfulNetworkResults.length > 0) {
    // 转换为UserPetInfo格式进行保存
    const userPetInfosToSave: UserPetInfo[] = successfulNetworkResults.map((result) => ({
      userid: result.userid,
      userName: result.userName,
      success: result.success,
      rawData: result.rawData,
      lastUpdated: result.lastUpdated,
    }));

    await smartSaveUserPetInfos(userPetInfosToSave);
  } else {
    // 这里是处理没有成功网络结果的情况，目前不需要特殊处理
  }

  // 返回所有结果
  return allResults;
}

/**
 * 从用户API响应中提取宠物ID
 * @param apiResponse - 用户API响应数据
 * @returns 宠物ID数组
 */
export function extractPetIdsFromApiResponse(apiResponse: any): string[] {
  const petIds: string[] = [];

  // 从pmr字段提取宠物ID
  if (apiResponse.pmr) {
    const ids = apiResponse.pmr.split('#').filter((id: string) => id.trim());
    petIds.push(...ids);
  }

  // 从logs字段提取宠物ID
  if (apiResponse.logs && Array.isArray(apiResponse.logs)) {
    apiResponse.logs.forEach((log: any) => {
      if (log.re && !petIds.includes(log.re.toString())) {
        petIds.push(log.re.toString());
      }
    });
  }

  return petIds;
}

/**
 * 获取数据库中所有用户的数据（转换为前端格式）
 * @returns 前端格式的用户数据数组
 */
export async function getAllUsersFromDatabase() {
  const { getAllUserIds, getUserPetInfo } = await import('./user-pet-database');

  const allUserIds = await getAllUserIds();
  const usersData: any[] = [];

  // 处理所有用户数据
  for (const userid of allUserIds) {
    const userPetInfo = await getUserPetInfo(userid);
    if (userPetInfo && userPetInfo.success && userPetInfo.rawData) {
      // 检查是否有宠物数据
      if (!userPetInfo.rawData.pmr || userPetInfo.rawData.pmr.trim() === '') {
        // 跳过没有宠物数据的用户
        continue;
      }

      // 转换为前端需要的格式
      const formattedUser: any = {
        userid: userPetInfo.userid,
        userName: userPetInfo.userName,
        success: userPetInfo.success,
        rawData: userPetInfo.rawData,
        lastUpdated: userPetInfo.lastUpdated,
      };

      // 从 rawData 中提取宠物ID和信息
      const petIds = extractPetIdsFromApiResponse(userPetInfo.rawData);
      const petInfos = getPetInfos(petIds);
      formattedUser.petIds = petIds;
      formattedUser.petInfos = petInfos;

      usersData.push(formattedUser);
    }
  }

  // 返回所有用户数据
  return usersData;
}
