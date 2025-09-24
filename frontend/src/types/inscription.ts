/**
 * @description 铭文的接口
 * @interface Inscription
 * @property {number} id - 铭文 ID
 * @property {string} name - 铭文名称
 * @property {number} price - 价格
 * @property {number} rmb - 人民币价格
 * @property {number} inscriptionType - 铭文类型
 * @property {number} level - 等级
 * @property {number} preLevelId - 上一级 ID
 * @property {number} nextLevelId - 下一级 ID
 * @property {string} desc - 描述
 */
export interface Inscription {
  id: number;
  name: string;
  price: number;
  rmb: number;
  inscriptionType: number;
  level: number;
  preLevelId: number;
  nextLevelId: number;
  desc: string;
}

/**
 * @description 铭文套装的接口
 * @interface InscriptionSuit
 * @property {number} id - 套装 ID
 * @property {string} name - 套装名称
 * @property {number[]} inscriptionIdList - 铭文 ID 列表
 * @property {string} dec - 描述
 */
export interface InscriptionSuit {
  id: number;
  name: string;
  inscriptionIdList: number[];
  dec: string;
}
