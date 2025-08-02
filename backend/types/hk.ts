/**
 * 表示魂卡数据
 */
export interface HKData {
  /** 魂卡ID */
  id: number;
  /** 魂卡名称 */
  name: string;
  /** 颜色 */
  color: number;
  /** 词条 */
  wordBar: string;
  /** 产出类型 */
  produceType: number;
}

/**
 * 表示魂卡Buff
 */
export interface HKBuff {
  /** Buff ID */
  id: number;
  /** Buff名称 */
  name: string;
  /** Buff描述 */
  decs: string[];
  /** 消耗 */
  costs: number[];
  /** 字体颜色 */
  fontColor: string;
  /** 颜色 */
  color: number;
  /** Buff名称列表 */
  buffNames: string[];
  /** 数值 */
  values: string[];
}

/**
 * 定义 hkdata.json 文件中已知的顶级子类
 */
export const HK_SUBCLASSES = ['data', 'buff'];
