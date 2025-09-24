/**
 * @description 宝箱配置的接口
 * @interface ChestConfig
 * @property {string} name - 宝箱名称
 * @property {(string | number)[]} data - 宝箱内容
 * @property {number[]} [random] - 随机内容
 */
export interface ChestConfig {
  name: string;
  data: (string | number)[];
  random?: number[];
}

/**
 * @description 礼品套装配置的接口
 * @interface GiftSultConfig
 * @property {string} name - 礼品套装名称
 * @property {string[]} data - 礼品套装内容
 */
export interface GiftSultConfig {
  name: string;
  data: string[];
}
