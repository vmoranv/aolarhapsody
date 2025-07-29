/**
 * 表示神迹亚比觉醒的数据
 */
export interface MiraclePetAwakeData {
  /** 神迹亚比的种族ID */
  miraclePetRaceId: number;
  /** 觉醒系列 */
  awakeSeries: string;
  /** 觉醒所需材料的ID */
  awakeMaterialId: number;
  /** 所需材料的数量 */
  needNum: number;
}

/**
 * 表示关于神迹亚比的信息
 */
export interface MiraclePetInfo {
  /** 亚比的种族ID */
  raceId: number;
  /** 基础能力配置 */
  baseAbilityConf: string;
  /** 被动技能的ID */
  passiveSkillIds: string;
  /** 亚比的突破等级 */
  breakLevel: number;
}

/**
 * 表示神迹亚比突破的数据
 */
export interface MiraclePetBreakData {
  /** 亚比的种族ID */
  raceId: number;
  /** 突破所需材料的ID */
  materialId: number;
  /** 使用材料增加能力的配置 */
  materialAddAbilityConf: string;
  /** 突破系列 */
  breakSeriers: string;
  /** 激励阶段的配置 */
  encouragePhaseConf: string;
}