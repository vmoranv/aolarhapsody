/**
 * 表示聊天框。
 */
export interface ChatFrame {
  /** 聊天框ID。 */
  id: number;
  /** 聊天框名称。 */
  name: string;
  /** 类型。 */
  type: number;
  /** 价格。 */
  price: number;
  /** 人民币价格。 */
  rmb: number;
  /** 等级。 */
  level: number;
  /** 描述。 */
  desc: string;
  /** 开始日期。 */
  startDate: string;
}
