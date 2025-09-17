import fs from 'fs-extra';
import path from 'path';
import { PetDataMap, UserPetDatabase, UserPetInfo } from '../types/petexchange';

const DATABASE_DIR = path.join(__dirname, '..', '.cache');
const DATABASE_FILE = path.join(DATABASE_DIR, 'user-pets.json');

// 确保.cache目录存在（应该已经存在，因为file-cache.ts会创建）
fs.ensureDirSync(DATABASE_DIR);

/**
 * 初始化用户宠物数据库
 */
async function initializeDatabase(): Promise<void> {
  if (!(await fs.pathExists(DATABASE_FILE))) {
    await fs.writeJson(DATABASE_FILE, {
      users: {},
      petDataMap: {},
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    });
  }
}

/**
 * 从数据库加载用户宠物信息
 * @returns 用户宠物数据库对象
 */
export async function loadUserPetDatabase(): Promise<UserPetDatabase> {
  await initializeDatabase();

  try {
    const data = await fs.readJson(DATABASE_FILE);
    return data as UserPetDatabase;
  } catch (error) {
    console.error('加载用户宠物数据库时出错:', error);
    return {
      users: {},
      petDataMap: {},
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * 保存用户宠物数据库
 * @param database 用户宠物数据库对象
 */
export async function saveUserPetDatabase(database: UserPetDatabase): Promise<void> {
  try {
    await fs.writeJson(DATABASE_FILE, database, { spaces: 2 });
  } catch (error) {
    console.error('保存用户宠物数据库时出错:', error);
    throw error;
  }
}

/**
 * 获取单个用户的宠物信息
 * @param userid 用户ID
 * @returns 用户宠物信息，如果不存在则返回null
 */
export async function getUserPetInfo(userid: string): Promise<UserPetInfo | null> {
  const database = await loadUserPetDatabase();
  return database.users[userid] || null;
}

/**
 * 保存单个用户的宠物信息
 * @param userPetInfo 用户宠物信息
 */
export async function saveUserPetInfo(userPetInfo: UserPetInfo): Promise<void> {
  const database = await loadUserPetDatabase();

  // 更新最后更新时间
  userPetInfo.lastUpdated = new Date().toISOString();
  database.lastUpdated = new Date().toISOString();

  database.users[userPetInfo.userid] = userPetInfo;
  await saveUserPetDatabase(database);
}

/**
 * 批量保存用户宠物信息
 * @param userPetInfos 用户宠物信息数组
 */
export async function saveUserPetInfos(userPetInfos: UserPetInfo[]): Promise<void> {
  const database = await loadUserPetDatabase();

  userPetInfos.forEach((userPetInfo) => {
    // 更新最后更新时间
    userPetInfo.lastUpdated = new Date().toISOString();
    database.users[userPetInfo.userid] = userPetInfo;
  });

  database.lastUpdated = new Date().toISOString();
  await saveUserPetDatabase(database);
}

/**
 * 获取所有已存储的用户ID
 * @returns 用户ID数组
 */
export async function getAllUserIds(): Promise<string[]> {
  const database = await loadUserPetDatabase();
  return Object.keys(database.users);
}

/**
 * 删除指定用户的宠物信息
 * @param userid 用户ID
 */
export async function deleteUserPetInfo(userid: string): Promise<void> {
  const database = await loadUserPetDatabase();
  delete database.users[userid];
  database.lastUpdated = new Date().toISOString();
  await saveUserPetDatabase(database);
}

/**
 * 清空所有用户宠物信息
 */
export async function clearAllUserPetInfo(): Promise<void> {
  await saveUserPetDatabase({
    users: {},
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  });
}

/**
 * 检查用户宠物信息是否过期
 * @param userid 用户ID
 * @param maxAge 最大缓存时间（毫秒），默认24小时
 * @returns 是否过期
 */
export async function isUserPetInfoExpired(
  userid: string,
  maxAge: number = 24 * 60 * 60 * 1000
): Promise<boolean> {
  const userPetInfo = await getUserPetInfo(userid);

  if (!userPetInfo) {
    return true; // 不存在视为过期
  }

  const lastUpdated = new Date(userPetInfo.lastUpdated).getTime();
  const now = Date.now();

  return now - lastUpdated > maxAge;
}

/**
 * 获取数据库统计信息
 * @returns 数据库统计信息
 */
export async function getDatabaseStats(): Promise<{
  totalUsers: number;
  successfulQueries: number;
  failedQueries: number;
  lastUpdated: string | null;
  hasPetDataMap: boolean;
}> {
  const database = await loadUserPetDatabase();
  const users = Object.values(database.users);

  const successfulQueries = users.filter((user) => user.success).length;
  const failedQueries = users.filter((user) => !user.success).length;

  const lastUpdated =
    users.length > 0
      ? users.reduce((latest, user) => {
          const userTime = new Date(user.lastUpdated).getTime();
          const latestTime = new Date(latest).getTime();
          return userTime > latestTime ? user.lastUpdated : latest;
        }, users[0].lastUpdated)
      : null;

  return {
    totalUsers: users.length,
    successfulQueries,
    failedQueries,
    lastUpdated,
    hasPetDataMap: !!database.petDataMap,
  };
}

/**
 * 增量保存用户宠物信息（智能判断是否需要更新）
 * @param userPetInfos 用户宠物信息数组
 * @returns 保存统计信息
 */
export async function saveUserPetInfosIncremental(userPetInfos: UserPetInfo[]): Promise<{
  total: number;
  newUsers: number;
  updatedUsers: number;
  skippedUsers: number;
}> {
  const database = await loadUserPetDatabase();

  let newUsers = 0;
  let updatedUsers = 0;
  let skippedUsers = 0;

  for (const userPetInfo of userPetInfos) {
    const existingUser = database.users[userPetInfo.userid];

    // 更新最后更新时间为当前时间
    userPetInfo.lastUpdated = new Date().toISOString();

    if (!existingUser) {
      // 新用户，直接保存
      database.users[userPetInfo.userid] = userPetInfo;
      newUsers++;
    } else {
      // 检查是否需要更新
      let shouldUpdate = false;

      // 1. 状态变化：从失败变为成功
      if (!existingUser.success && userPetInfo.success) {
        shouldUpdate = true;
      }
      // 2. 宠物列表变化 - 从 rawData 动态提取比较
      else if (
        userPetInfo.success &&
        existingUser.success &&
        JSON.stringify(extractPetIdsFromApiResponse(existingUser.rawData)) !==
          JSON.stringify(extractPetIdsFromApiResponse(userPetInfo.rawData))
      ) {
        shouldUpdate = true;
      }
      // 3. 用户名变化
      else if (existingUser.userName !== userPetInfo.userName) {
        shouldUpdate = true;
      }
      // 4. 成功状态下的数据更新（即使24小时未过期，有新数据也应该更新）
      else if (
        userPetInfo.success &&
        existingUser.success &&
        JSON.stringify(existingUser.rawData) !== JSON.stringify(userPetInfo.rawData)
      ) {
        shouldUpdate = true;
      }
      // 5. 错误状态变化（不同的错误信息）
      else if (
        !userPetInfo.success &&
        !existingUser.success &&
        existingUser.error !== userPetInfo.error
      ) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        database.users[userPetInfo.userid] = userPetInfo;
        updatedUsers++;
      } else {
        skippedUsers++;
      }
    }
  }

  database.lastUpdated = new Date().toISOString();
  await saveUserPetDatabase(database);

  return {
    total: userPetInfos.length,
    newUsers,
    updatedUsers,
    skippedUsers,
  };
}

/**
 * 智能批量保存用户宠物信息（自动去重和增量更新）
 * @param userPetInfos 用户宠物信息数组
 * @returns 保存统计信息
 */
export async function smartSaveUserPetInfos(userPetInfos: UserPetInfo[]): Promise<{
  total: number;
  newUsers: number;
  updatedUsers: number;
  skippedUsers: number;
}> {
  // 首先对用户ID进行去重，保留最新的数据
  const uniqueUserMap = new Map<string, UserPetInfo>();

  for (const userPetInfo of userPetInfos) {
    const existing = uniqueUserMap.get(userPetInfo.userid);

    if (
      !existing ||
      new Date(userPetInfo.lastUpdated).getTime() > new Date(existing.lastUpdated).getTime()
    ) {
      uniqueUserMap.set(userPetInfo.userid, userPetInfo);
    }
  }

  const uniqueUserInfos = Array.from(uniqueUserMap.values());

  // 使用增量保存函数
  return await saveUserPetInfosIncremental(uniqueUserInfos);
}

/**
 * 获取需要刷新的用户ID列表
 * @param maxAge 最大缓存时间（毫秒），默认24小时
 * @returns 需要刷新的用户ID数组
 */
export async function getStaleUserIds(maxAge: number = 24 * 60 * 60 * 1000): Promise<string[]> {
  const database = await loadUserPetDatabase();
  const staleUserIds: string[] = [];

  for (const [userid, userPetInfo] of Object.entries(database.users)) {
    const lastUpdated = new Date(userPetInfo.lastUpdated).getTime();
    const now = Date.now();

    if (now - lastUpdated > maxAge) {
      staleUserIds.push(userid);
    }
  }

  return staleUserIds;
}

/**
 * 保存或更新宠物数据字典
 * @param petDataMap 宠物数据字典
 */
export async function savePetDataMap(petDataMap: PetDataMap): Promise<void> {
  const database = await loadUserPetDatabase();
  database.petDataMap = petDataMap;
  database.lastUpdated = new Date().toISOString();
  await saveUserPetDatabase(database);
}

/**
 * 获取宠物数据字典
 * @returns 宠物数据字典，如果不存在则返回空对象
 */
export async function getPetDataMap(): Promise<PetDataMap> {
  const database = await loadUserPetDatabase();
  return database.petDataMap || {};
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
