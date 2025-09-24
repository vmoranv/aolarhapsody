/**
 * @description 通用 Buff 的接口
 * @interface CommonBuff
 * @property {number} id - Buff ID
 * @property {string} tips - Buff 提示
 * @property {string} detailTips - Buff 详细提示
 * @property {number} type - Buff 类型
 * @property {string} simpleTips - Buff 简单提示
 * @property {string} defaultValue - Buff 默认值
 */
export interface CommonBuff {
  id: number;
  tips: string;
  detailTips: string;
  type: number;
  simpleTips: string;
  defaultValue: string;
}
