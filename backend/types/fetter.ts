/**
 * @description 羁绊的接口
 * @interface Fetter
 * @property {number} id - 羁绊 ID
 * @property {string} type - 羁绊类型
 * @property {string} name - 羁绊名称
 * @property {number[]} conditions - 激活条件
 * @property {string[]} descs - 羁绊描述
 */
export interface Fetter {
  id: number;
  type: string;
  name: string;
  conditions: number[];
  descs: string[];
}
