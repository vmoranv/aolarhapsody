/**
 * 表示头像框
 */
export interface HeadFrame {
  /** 头像框ID */
  id: number;
  /** 头像框名称 */
  name: string;
  /** 类型 */
  type: number;
  /** 价格 */
  price: number;
  /** 人民币价格 */
  rmb: number;
  /** 等级 */
  level: number;
  /** 描述 */
  desc: string;
  /** 开始日期 */
  startDate: string;
}

/**
 * 定义 headframedata.json 文件中已知的顶级子类
 */
export const HEADFRAME_SUBCLASSES = ['data'];
