/**
 * 表示亚比领域战
 */
export interface PetTerritoryFight {
  /** 领域ID */
  id: number;
  /** 领域名称 */
  name: string;
  /** 角色描述 */
  characterDes: string;
  /** 全区域力量描述 */
  allAreaPowerDes?: string;
  /** 主要区域力量描述 */
  mainAreaPowerDes?: string;
  /** 领域详细描述 */
  territoryDetailDes?: string;
  /** 领域简单描述 */
  territorySimpleDes?: string;
}

/**
 * 表示亚比领域羁绊
 */
export interface PetTerritoryFetter {
  /** 羁绊ID */
  id: number;
  /** 羁绊名称 */
  name: string;
  /** 条件 */
  conditions: string[];
}

/**
 * 表示亚比领域战数据
 */
export interface PetTerritoryFightData {
  /** 领域数据 */
  data: Record<number, PetTerritoryFight>;
  /** 羁绊数据 */
  fetter: Record<number, PetTerritoryFetter>;
}

/**
 * 定义 petterritoryfightdata.json 文件中已知的顶级子类
 */
export const PETTERRITORYFIGHT_SUBCLASSES = ['data', 'fetter'];
