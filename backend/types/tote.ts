/**
 * 表示一个魂器的数据
 */
export interface ToteData {
  /** 魂器的ID */
  id: number;
  /** 魂器的名称 */
  name: string;
  /** 魂器的颜色 */
  color: number;
  /** 魂器的类型 */
  type: number;
  /** 魂器的基础值 */
  baseValue: string;
  /** 魂器的效果值 */
  effectValue: string;
  /** 魂器的优势值 */
  advantageValue: string;
  /** 魂器在图鉴中的描述 */
  tujianDes: string;
}

/**
 * 表示一个魂器的词条数据
 */
export interface ToteEntryData {
  /** 魂器词条的ID */
  id: number;
  /** 魂器词条的名称 */
  name: string;
  /** 魂器词条的描述 */
  des: string;
}

/**
 * 表示一个魂器的数值数据
 */
export interface ToteValueData {
  /** 魂器数值的ID */
  id: number;
  /** 魂器数值的名称 */
  name: string;
  /** 魂器数值的描述 */
  des: string;
  /** 魂器数值的数据字符串 */
  dataStr: string;
  /** 魂器数值的优势比率 */
  advantageRadio: number;
}

/**
 * 表示魂器数据的集合
 */
export interface Tote {
  /** 魂器数据数组 */
  data: ToteData[];
  /** 魂器词条数据数组 */
  entry: ToteEntryData[];
  /** 魂器数值数据数组 */
  value: ToteValueData[];
}

/**
 * 定义 totedata.json 文件中已知的顶级子类
 */
export const TOTE_SUBCLASSES = ['data', 'entry', 'value'];
