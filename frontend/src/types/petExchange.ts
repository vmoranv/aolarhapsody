// 宠物数据接口，用于DataView
export interface PetData {
  id: string;
  name: string;
  type: 'gold' | 'silver' | 'copper' | 'unknown';
  imageUrl: string;
}

// 用户数据接口，用于DataView显示
export interface UserData {
  id: string;
  name: string;
  userid: string;
  pets: PetData[];
  success: boolean;
  error?: string;
}

// 扩展UserData类型以包含数据来源信息
export interface ExtendedUserData extends UserData {
  source?: 'database' | 'network';
}
