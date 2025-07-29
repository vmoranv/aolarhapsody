/**
 * 表示称号。
 */
export interface Title {
  /** 称号ID。 */
  titleId: number;
  /** 称号名称。 */
  titleName: string;
  /** 称号等级。 */
  titleLev: number;
  /** 称号提示。 */
  titleTips: string;
  /** 称号是否为VIP。 */
  titleIsVip: boolean;
  /** 称号有效时间。 */
  titleTime: string;
  /** 称号显示类型。 */
  titleDisplayType: number;
  /** 开始时间。 */
  startTime: string;
}

/**
 * 表示称号配置。
 */
export interface TitleConfig {
  [id: string]: number[];
}

/**
 * 表示称号数据。
 */
export interface TitleData {
  /** 称号配置。 */
  titleConfig: TitleConfig;
  /** 称号数据列表。 */
  data: Title[];
}