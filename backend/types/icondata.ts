/**
 * 表示亚比图标
 */
export interface PetIcon {
  /** 视图ID */
  viewId: number;
  /** 图标类型 */
  iconType: number;
}

/**
 * 表示头像图标
 */
export interface HeadIcon {
  /** 图标ID */
  id: number;
  /** 图标名称 */
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
 * 定义 peticondata.json 文件中已知的顶级子类
 */
export const PETICON_SUBCLASSES = [];

/**
 * 定义 headicondata.json 文件中已知的顶级子类
 */
export const HEADICON_SUBCLASSES = ['data'];
