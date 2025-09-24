/**
 * @description 通用数据项接口
 * @interface DataItem
 * @property {number | string} id - 数据项的唯一标识
 * @property {string} name - 数据项的名称
 * @property {any} [key: string] - 其他任意属性
 */
export interface DataItem {
  id: number | string;
  name: string;
  [key: string]: any;
}
