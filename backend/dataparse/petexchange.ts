import axios from 'axios';
import { PetDataMap, PetInfo, UserPetInfo } from '../types/petexchange';
import { URL_CONFIG } from '../types/urlconfig';
import { getFromCache, saveToCache } from './file-cache';
import { fetchJavaScriptFile } from './gamedataparser';
import {
  getPetDataMap,
  getUserPetInfo,
  savePetDataMap,
  smartSaveUserPetInfos,
} from './user-pet-database';

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
 * 迁移现有的宠物数据到新的数据库结构
 * 这个函数用于处理重构后数据结构的兼容性问题
 */
export async function migratePetDataToNewStructure(): Promise<void> {
  try {
    const dbPetDataMap = await getPetDataMap();

    // 如果数据库中已经有 petDataMap，不需要迁移
    if (Object.keys(dbPetDataMap).length > 0) {
      return;
    }

    // 如果内存中有数据但数据库中没有，进行迁移
    if (Object.keys(petDataCache).length > 0) {
      await savePetDataMap(petDataCache);
      return;
    }

    // 如果内存中也没有数据，尝试从旧的缓存文件中读取
    const cachedData = await getFromCache<PetDataMap>(URL_CONFIG.yabiJs);

    if (cachedData && Object.keys(cachedData).length > 0) {
      Object.assign(petDataCache, cachedData);
      await savePetDataMap(cachedData);
      return;
    }
  } catch (error) {
    console.error('迁移宠物数据结构时出错:', error);
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
 * 批量查询用户宠物信息（直接网络请求 + 增量存储）
 * @param userIdList - 用户ID列表
 * @param useCache - 是否使用缓存作为后备，默认为true
 * @returns 查询结果数组
 */
export async function batchQueryUserPets(userIdList: string[], useCache: boolean = true) {
  const results: UserPetInfo[] = [];
  const failedUserIds: string[] = [];

  // 首先对用户ID进行去重
  const uniqueUserIds = [...new Set(userIdList)];

  // 直接批量请求网络数据
  for (const userid of uniqueUserIds) {
    try {
      // 调用真实的API端点
      const apiUrl = `${URL_CONFIG.api.userService}?otherid=${userid}&userid=0&token=&_=${Date.now()}`;
      const refererUrl = `${URL_CONFIG.api.friendPage}?userid=${userid}`;

      const apiResponse = await axios.get(apiUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: '*/*',
          Referer: refererUrl,
        },
        timeout: 10000,
      });

      // 解析JSONP响应
      let jsonData;
      if (typeof apiResponse.data === 'string') {
        // 移除JSONP包装
        const jsonMatch = apiResponse.data.match(/\((.*)\)/);
        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[1]);
        } else {
          jsonData = JSON.parse(apiResponse.data);
        }
      } else {
        jsonData = apiResponse.data;
      }

      // 检查API响应结构
      if (jsonData.code === 0) {
        const { data } = jsonData;

        // 检查是否有宠物数据 - pmr不能为空
        if (!data.pmr || data.pmr.trim() === '') {
          const userPetInfo: UserPetInfo = {
            userid: userid,
            userName: data.nn || data.uname || data.nickname || data.name || `用户${userid}`,
            success: false,
            error: '用户没有宠物数据',
            rawData: data,
            lastUpdated: new Date().toISOString(),
          };

          results.push(userPetInfo);
          failedUserIds.push(userid);
          continue;
        }

        // 提取用户名称 - 优先从 rawData.nn 字段提取
        const userName = data.nn || data.uname || data.nickname || data.name || `用户${userid}`;

        // 提取宠物ID
        extractPetIdsFromApiResponse(data);

        // 获取宠物详细信息
        const userPetInfo: UserPetInfo = {
          userid: userid,
          userName: userName,
          success: true,
          rawData: data,
          lastUpdated: new Date().toISOString(),
        };

        results.push(userPetInfo);
      } else {
        const userPetInfo: UserPetInfo = {
          userid: userid,
          userName: `用户${userid}`,
          success: false,
          error: 'API request failed',
          apiResponse: jsonData,
          lastUpdated: new Date().toISOString(),
        };

        results.push(userPetInfo);
        failedUserIds.push(userid);
      }
    } catch (error) {
      const userPetInfo: UserPetInfo = {
        userid: userid,
        userName: `用户${userid}`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastUpdated: new Date().toISOString(),
      };

      results.push(userPetInfo);
      failedUserIds.push(userid);
    }
  }

  // 只保存成功的查询结果到数据库
  const successfulResults = results.filter((result) => result.success);
  if (successfulResults.length > 0) {
    await smartSaveUserPetInfos(successfulResults);

    // 确保宠物数据字典已保存到数据库
    await ensurePetDataMapSaved();
  } else {
    console.warn('没有成功的查询结果需要保存');
  }

  // 清理数据库中的失败数据：删除当前查询中失败的用户数据（如果存在）
  const currentFailedUserIds = results
    .filter((result) => !result.success)
    .map((result) => result.userid);
  if (currentFailedUserIds.length > 0) {
    const { deleteUserPetInfo } = await import('./user-pet-database');
    for (const userid of currentFailedUserIds) {
      try {
        await deleteUserPetInfo(userid);
      } catch (error) {
        console.error(`删除失败用户数据时出错 ${userid}:`, error);
      }
    }
  }

  // 如果有失败的用户且启用了缓存，尝试从缓存中获取
  if (failedUserIds.length > 0 && useCache) {
    for (const userid of failedUserIds) {
      const cachedInfo = await getUserPetInfo(userid);
      if (cachedInfo && cachedInfo.success && cachedInfo.rawData) {
        // 检查缓存中的数据是否有宠物数据
        if (!cachedInfo.rawData.pmr || cachedInfo.rawData.pmr.trim() === '') {
          // 缓存中的数据也没有宠物，不替换失败结果
          continue;
        }

        // 找到缓存的成功数据，替换失败的结果
        const index = results.findIndex((r) => r.userid === userid);
        if (index !== -1) {
          // 转换缓存数据为前端需要的格式
          const formattedCachedInfo: any = {
            userid: cachedInfo.userid,
            userName: cachedInfo.userName,
            success: cachedInfo.success,
            rawData: cachedInfo.rawData,
            lastUpdated: cachedInfo.lastUpdated,
          };

          // 从 rawData 中提取宠物ID和信息
          const petIds = extractPetIdsFromApiResponse(cachedInfo.rawData);
          const petInfos = getPetInfos(petIds);

          formattedCachedInfo.petIds = petIds;
          formattedCachedInfo.petInfos = petInfos;

          results[index] = formattedCachedInfo;
        }
      }
    }
  }

  // 转换结果为前端需要的格式并直接返回
  return results.map((result) => {
    const formattedResult: any = {
      userid: result.userid,
      userName: result.userName,
      success: result.success,
      rawData: result.rawData,
      lastUpdated: result.lastUpdated,
    };

    if (result.success && result.rawData) {
      // 从 rawData 中提取宠物ID和信息
      const petIds = extractPetIdsFromApiResponse(result.rawData);
      const petInfos = getPetInfos(petIds);

      formattedResult.petIds = petIds;
      formattedResult.petInfos = petInfos;
    } else {
      formattedResult.error = result.error;
      formattedResult.apiResponse = result.apiResponse;
    }

    return formattedResult;
  });
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
 * 刷新所有已存储用户的宠物信息
 * @param batchSize - 每批处理的用户数量，默认为10
 * @param delay - 批次之间的延迟（毫秒），默认为1000
 * @returns 刷新结果统计
 */
export async function refreshAllUserPets(batchSize: number = 10, delay: number = 1000) {
  const { getAllUserIds } = await import('./user-pet-database');
  const allUserIds = await getAllUserIds();

  let successCount = 0;
  let failureCount = 0;
  const cachedCount = 0;

  // 分批处理用户ID
  for (let i = 0; i < allUserIds.length; i += batchSize) {
    const batch = allUserIds.slice(i, i + batchSize);

    try {
      // 强制刷新这批用户的数据
      const results = await batchQueryUserPets(batch, true);

      // 统计结果
      results.forEach((result) => {
        if (result.success) {
          successCount++;
        } else {
          failureCount++;
        }
      });

      // 如果不是最后一批，添加延迟
      if (i + batchSize < allUserIds.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`处理第 ${Math.floor(i / batchSize) + 1} 批用户时出错:`, error);
      failureCount += batch.length;
    }
  }

  return {
    totalUsers: allUserIds.length,
    successCount,
    failureCount,
    cachedCount,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 获取用户宠物信息数据库统计信息
 * @returns 数据库统计信息
 */
export async function getUserPetDatabaseStats() {
  const { getDatabaseStats } = await import('./user-pet-database');
  return await getDatabaseStats();
}

/**
 * 清空所有用户宠物信息缓存
 * @returns 操作结果
 */
export async function clearAllUserPetCache() {
  const { clearAllUserPetInfo } = await import('./user-pet-database');
  await clearAllUserPetInfo();
  return { success: true, message: '所有用户宠物信息缓存已清空' };
}

/**
 * 获取数据库中所有用户的数据（转换为前端格式）
 * @returns 前端格式的用户数据数组
 */
export async function getAllUsersFromDatabase() {
  const { getAllUserIds, getUserPetInfo } = await import('./user-pet-database');

  const allUserIds = await getAllUserIds();
  const usersData: any[] = [];

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

  return usersData;
}
