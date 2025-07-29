/**
 * 表示银河舰队徽章。
 */
export interface GalaxyFleetMark {
  /** 徽章ID。 */
  id: number;
  /** 徽章名称。 */
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