/**
 * 表示一个铭文。
 */
export interface Inscription {
  /** 铭文的ID。 */
  id: number;
  /** 铭文的名称。 */
  name: string;
  /** 铭文的价格。 */
  price: number;
  /** 铭文的人民币价格。 */
  rmb: number;
  /** 铭文的类型。 */
  inscriptionType: number;
  /** 铭文的等级。 */
  level: number;
  /** 上一级铭文的ID。 */
  preLevelId: number;
  /** 下一级铭文的ID。 */
  nextLevelId: number;
  /** 铭文的描述。 */
  desc: string;
}