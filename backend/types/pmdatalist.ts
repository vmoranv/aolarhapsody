/**
 * 表示一只亚比。
 */
export interface Pet {
  /** 亚比的ID。 */
  id: string | number;
  /** 与亚比相关的原始数据。 */
  rawData: (string | number)[];
}

/**
 * 表示天气状况。
 */
export interface Weather {
  /** 天气状况的ID。 */
  id: string;
  /** 天气状况的名称。 */
  name: string;
  /** 天气状况的类型。 */
  type: number;
  /** 天气状况的服务器端描述。 */
  serverDescription: string;
  /** 天气状况的客户端描述。 */
  description: string;
  /** 有关传奇魂的可选信息。 */
  legendSoul?: {
    /** 传奇魂的基本描述。 */
    baseDescription: string;
    /** 传奇魂的序列列表。 */
    serials: string[];
    /** 传奇魂的最高等级。 */
    maxLevel: number;
  };
}

/**
 * 表示一个技能。
 */
export interface Skill {
  /** 技能的ID。 */
  id: number;
  /** 技能的英文名称。 */
  enName: string;
  /** 技能的中文名称。 */
  cnName: string;
  /** 技能的新中文名称。 */
  newCnName: string;
  /** 技能的旧效果描述。 */
  oldEffectDesc: string;
  /** 技能的新效果描述。 */
  newEffectDesc: string;
  /** 技能的客户端描述。 */
  clientDesc: string;
  /** 技能的威力。 */
  power: number;
  /** 技能的命中率。 */
  hitRate: number;
  /** 技能的总PP值。 */
  allPP: number;
  /** 技能的优先级。 */
  PRI: number;
  /** 技能的属性类型。 */
  attributeType: number;
  /** 技能的攻击类型。 */
  attackType: number;
  /** 技能的命中目标。 */
  hitTaget: number;
  /** 技能的暴击率。 */
  critRate: number;
  /** 技能的伤害类型。 */
  damageType: number;
  /** 技能的执行类型。 */
  execType: string;
  /** 技能的处理程序。 */
  handler: string;
  /** 技能的参数。 */
  param: string;
  /** 技能的奥义类型。 */
  aoyiType: number;
  /** 技能是否为完整的PM技能。 */
  isCompletePMSkill: boolean;
  /** 第一个技能动画。 */
  skillMovie1: string;
  /** 第二个技能动画。 */
  skillMovie2: string;
  /** 技能在单打中的威力。 */
  singlePower: string;
  /** 技能在双打中的威力。 */
  doublePower: string;
  /** 技能的类型。 */
  skillType: number;
  /** 技能消耗的魂数。 */
  costSoulNum: number;
  /** 技能可以消耗的最大魂数。 */
  maxCostSoulNum: number;
  /** 配置技能序列。 */
  configSkillSerials: string;
  /** 传奇领域效果的变化。 */
  legendFiledEffectChange: number;
  /** 传奇领域效果的描述。 */
  legendFiledEffectDesc: string;
  /** 技能是否为退化星灵被动。 */
  isDegeneratorSpiritPassive: boolean;
  /** 简单的技能描述。 */
  simpleSkillDec: string;
  /** 受击动画的类型。 */
  beAttackMvType: number;
  /** 技能的冷却时间。 */
  cd: number;
}

/**
 * 表示一个技能属性，由数字和字符串组成的元组。
 */
export type SkillAttribute = [number, string];

/**
 * 表示一个处理过的属性，包含ID、名称和一个布尔值，指示它是否为超属性。
 */
export type ProcessedAttribute = { id: number; name: string; isSuper: boolean };