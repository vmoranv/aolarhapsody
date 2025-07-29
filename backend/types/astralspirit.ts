/**
 * 表示星灵。
 */
export interface AstralSpirit {
  /** 星灵ID。 */
  id: number;
  /** 星灵名称。 */
  name: string;
  /** 子类型。 */
  subtype: number;
  /** 价格。 */
  price: number;
  /** 人民币价格。 */
  rmb: number;
  /** 每日数量。 */
  dailyQuantity: number;
  /** 是否出售。 */
  sale: boolean;
  /** 是否为VIP。 */
  vip: boolean;
  /** 是否可交易。 */
  trade: boolean;
  /** 最大数量。 */
  maxQuantity: number;
  /** 生命值。 */
  hp: number;
  /** 攻击力。 */
  attack: number;
  /** 防御力。 */
  defend: number;
  /** 特殊攻击力。 */
  sAttack: number;
  /** 特殊防御力。 */
  sDefend: number;
  /** 速度。 */
  speed: number;
  /** 生命值增量。 */
  hpInc: number;
  /** 攻击力增量。 */
  attackInc: number;
  /** 防御力增量。 */
  defendInc: number;
  /** 特殊攻击力增量。 */
  sAttackInc: number;
  /** 特殊防御力增量。 */
  sDefendInc: number;
  /** 速度增量。 */
  speedInc: number;
  /** 套装ID。 */
  suitId: number;
  /** 强度类型。 */
  strengthType: number;
  /** 限制日期。 */
  limitDate: string;
}

/**
 * 表示星灵套装。
 */
export interface AstralSpiritSuit {
  /** 套装ID。 */
  id: number;
  /** 套装名称。 */
  name: string;
  /** 组成套装的星灵ID列表。 */
  surIds: number[];
  /** 激活所需数量。 */
  activeNeed: number;
  /** 套装效果描述。 */
  suitEffectDes: string;
  /** 一件神话套装效果描述。 */
  oneShenhuaSuitEffectDes: string;
  /** 三件神话套装效果描述。 */
  threeShenHuaSuitEffectDes: string;
}