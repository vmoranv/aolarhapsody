export interface Pet {
  id: string | number;
  rawData: (string | number)[];
}

export interface Weather {
  id: string;
  name: string;
  type: number;
  serverDescription: string;
  description: string;
  legendSoul?: {
    baseDescription: string;
    serials: string[];
    maxLevel: number;
  };
}

export interface Skill {
  id: number;
  enName: string;
  cnName: string;
  newCnName: string;
  oldEffectDesc: string;
  newEffectDesc: string;
  clientDesc: string;
  power: number;
  hitRate: number;
  allPP: number;
  PRI: number;
  attributeType: number;
  attackType: number;
  hitTaget: number;
  critRate: number;
  damageType: number;
  execType: string;
  handler: string;
  param: string;
  aoyiType: number;
  isCompletePMSkill: boolean;
  skillMovie1: string;
  skillMovie2: string;
  singlePower: string;
  doublePower: string;
  skillType: number;
  costSoulNum: number;
  maxCostSoulNum: number;
  configSkillSerials: string;
  legendFiledEffectChange: number;
  legendFiledEffectDesc: string;
  isDegeneratorSpiritPassive: boolean;
  simpleSkillDec: string;
  beAttackMvType: number;
  cd: number;
}

export type SkillAttribute = [number, string];
export type ProcessedAttribute = { id: number; name: string; isSuper: boolean };