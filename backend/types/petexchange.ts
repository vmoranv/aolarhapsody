/**
 * 宠物信息接口
 */
export interface PetInfo {
  /** 宠物ID */
  id: string;
  /** 宠物名称 */
  name: string;
  /** 宠物类型 */
  type: 'gold' | 'silver' | 'copper' | 'unknown';
}

/**
 * 宠物数据映射接口
 */
export interface PetDataMap {
  [petId: string]: PetInfo;
}

/**
 * 用户宠物信息接口（简化版，只存储原始数据）
 */
export interface UserPetInfo {
  /** 用户ID */
  userid: string;
  /** 用户名称 */
  userName: string;
  /** 查询是否成功 */
  success: boolean;
  /** 原始API响应数据 */
  rawData?: any;
  /** 错误信息（如果查询失败） */
  error?: string;
  /** API响应（如果查询失败） */
  apiResponse?: any;
  /** 最后更新时间 */
  lastUpdated: string;
}

/**
 * 用户查询结果接口
 */
export interface UserQueryResult {
  /** 用户ID */
  userid: string;
  /** 用户名称 */
  userName?: string;
  /** 查询是否成功 */
  success: boolean;
  /** 宠物ID列表 */
  petIds?: string[];
  /** 宠物信息列表 */
  petInfos?: any[];
  /** 原始数据 */
  rawData?: any;
  /** 错误信息 */
  error?: string;
  /** API响应 */
  apiResponse?: any;
}

/**
 * 用户宠物数据库接口
 */
export interface UserPetDatabase {
  /** 用户宠物信息映射 */
  users: {
    [userid: string]: UserPetInfo;
  };
  /** 全局宠物类型字典 */
  petDataMap?: PetDataMap;
  /** 最后更新时间 */
  lastUpdated?: string;
  /** 数据库版本 */
  version?: string;
}
