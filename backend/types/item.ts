/**
 * 表示一个道具
 */
export interface Item {
  /** 道具的ID */
  id: number;
  /** 道具的名称 */
  name: string;
  /** 道具的类型 */
  type: number;
  /** 道具的价格 */
  price: number;
  /** 道具的人民币价格 */
  rmb: number;
  /** 道具的每日数量 */
  dailyQuantity: number;
  /** 道具是否可堆叠 */
  stackable: boolean;
  /** 道具是否可出售 */
  sellable: boolean;
  /** 道具是否可交易 */
  tradeable: boolean;
  /** 道具的最大数量 */
  maxQuantity: number;
  /** 道具的描述 */
  des: string;
}
/**
 * 定义 itemdata.json 文件中已知的顶级子类
 */
export const ITEM_SUBCLASSES = ['data', 'petitem'];
