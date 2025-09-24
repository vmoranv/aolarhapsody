import { DataItem } from './DataItem';

/**
 * @description 神卡数据接口
 * @property {number} cardId - 卡片 ID
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
 */
export interface GodCard extends DataItem {
  cardId: number;
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
}

/**
 * @description 神卡套装数据接口
 * @property {number} suitType - 套装类型
 * @property {number[]} godCardidList - 神卡 ID 列表
 * @property {string} dec - 描述
 */
export interface GodCardSuit extends DataItem {
  suitType: number;
  godCardidList: number[];
  dec: string;
}
