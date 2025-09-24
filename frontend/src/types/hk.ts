/**
 * @description 魂卡数据接口
 * @property {number} id - ID
 * @property {string} name - 名称
 * @property {number} color - 颜色
 * @property {string} wordBar - 词条
 * @property {number} produceType - 产出类型
 */
export interface HKData {
  id: number;
  name: string;
  color: number;
  wordBar: string;
  produceType: number;
}

/**
 * @description 魂卡 Buff 接口
 * @property {number} id - ID
 * @property {string} name - 名称
 * @property {string[]} decs - 描述
 * @property {number[]} costs - 消耗
 * @property {string} fontColor - 字体颜色
 * @property {number} color - 颜色
 * @property {string[]} buffNames - Buff 名称
 * @property {string[]} values - 值
 */
export interface HKBuff {
  id: number;
  name: string;
  decs: string[];
  costs: number[];
  fontColor: string;
  color: number;
  buffNames: string[];
  values: string[];
}
