/**
 * 表示神兵卡
 */
export interface GodCard {
  /** 卡片ID */
  cardId: number;
  /** 名称 */
  name: string;
  /** 品质 */
  quality: number;
  /** 生命值 */
  hp: number;
  /** 速度 */
  speed: number;
  /** 攻击力 */
  attack: number;
  /** 防御力 */
  defend: number;
  /** 特殊攻击力 */
  sAttack: number;
  /** 特殊防御力 */
  sDefend: number;
  /** 描述 */
  desc: string;
  /** 限制的种族ID */
  limitRaceId: number[];
  /** 视图ID */
  viewId: number;
  /** 等级 */
  level: number;
  /** 升级ID */
  levelUpId: number;
  /** 合成类型 */
  synthesisType: number;
  /** 限制扩展附加 */
  limitExtAppend: null;
  /** 原始卡片ID */
  originCardId: number;
}

/**
 * 表示神兵卡套装
 */
export interface GodCardSuit {
  /** 套装ID */
  id: number;
  /** 套装类型 */
  suitType: number;
  /** 套装名称 */
  name: string;
  /** 组成套装的神兵卡ID列表 */
  godCardidList: number[];
  /** 套装效果描述 */
  dec: string;
}