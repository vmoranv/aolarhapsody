export interface MiraclePetAwakeData {
  miraclePetRaceId: number;
  awakeSeries: string;
  awakeMaterialId: number;
  needNum: number;
}

export interface MiraclePetInfo {
  raceId: number;
  baseAbilityConf: string;
  passiveSkillIds: string;
  breakLevel: number;
}

export interface MiraclePetBreakData {
  raceId: number;
  materialId: number;
  materialAddAbilityConf: string;
  breakSeriers: string;
  encouragePhaseConf: string;
}