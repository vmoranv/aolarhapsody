/**
 * @description 星灵数据接口
 * @property {string} id - ID
 * @property {string} name - 名称
 * @property {number} type - 类型
 * @property {number} quality - 品质
 * @property {number} hp - 生命值
 * @property {number} speed - 速度
 * @property {number} attack - 攻击
 * @property {number} defend - 防御
 * @property {number} sAttack - 特殊攻击
 * @property {number} sDefend - 特殊防御
 * @property {string} desc - 描述
 * @property {number[]} limitRaceId - 限制种族 ID
 * @property {number} viewId - 视图 ID
 * @property {number} level - 等级
 * @property {number} levelUpId - 升级 ID
 * @property {number} synthesisType - 合成类型
 * @property {null} limitExtAppend - 限制扩展附加
 * @property {number} originCardId - 原始卡片 ID
 * @property {number} [subtype] - 子类型
 * @property {number} [price] - 价格
 * @property {number} [rmb] - 人民币价格
 * @property {number} [dailyQuantity] - 每日数量
 * @property {boolean} [sale] - 是否出售
 * @property {boolean} [vip] - 是否 VIP
 * @property {boolean} [trade] - 是否可交易
 * @property {number} [maxQuantity] - 最大数量
 * @property {number} [hpInc] - 生命值增量
 * @property {number} [attackInc] - 攻击增量
 * @property {number} [defendInc] - 防御增量
 * @property {number} [sAttackInc] - 特殊攻击增量
 * @property {number} [sDefendInc] - 特殊防御增量
 * @property {number} [speedInc] - 速度增量
 * @property {number} [suitId] - 套装 ID
 * @property {number} [strengthType] - 强度类型
 * @property {string} [limitDate] - 限制日期
 */
export interface AstralSpirit {
  id: string;
  name: string;
  type: number;
  quality: number;
  hp: number;
  speed: number;
  attack: number;
  defend: number;
  sAttack: number;
  sDefend: number;
  desc: string;
  limitRaceId: number[];
  viewId: number;
  level: number;
  levelUpId: number;
  synthesisType: number;
  limitExtAppend: null;
  originCardId: number;
  subtype?: number;
  price?: number;
  rmb?: number;
  dailyQuantity?: number;
  sale?: boolean;
  vip?: boolean;
  trade?: boolean;
  maxQuantity?: number;
  hpInc?: number;
  attackInc?: number;
  defendInc?: number;
  sAttackInc?: number;
  sDefendInc?: number;
  speedInc?: number;
  suitId?: number;
  strengthType?: number;
  limitDate?: string;
}

/**
 * @description 星灵套装数据接口
 * @property {number} id - ID
 * @property {number} suitType - 套装类型
 * @property {string} name - 名称
 * @property {number[]} astralSpiritIdList - 星灵 ID 列表
 * @property {string} dec - 描述
 * @property {number[]} [surIds] - 替代 ID
 * @property {number} [activeNeed] - 激活需要
 * @property {string} [suitEffectDes] - 套装效果描述
 * @property {string} [oneShenhuaSuitEffectDes] - 单个神话套装效果描述
 * @property {string} [threeShenHuaSuitEffectDes] - 三个神话套装效果描述
 */
export interface AstralSpiritSuit {
  id: number;
  suitType: number;
  name: string;
  astralSpiritIdList: number[];
  dec: string;
  surIds?: number[];
  activeNeed?: number;
  suitEffectDes?: string;
  oneShenhuaSuitEffectDes?: string;
  threeShenHuaSuitEffectDes?: string;
}
