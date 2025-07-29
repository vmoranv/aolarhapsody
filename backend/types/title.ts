export interface Title {
  titleId: number;
  titleName: string;
  titleLev: number;
  titleTips: string;
  titleIsVip: boolean;
  titleTime: string;
  titleDisplayType: number;
  startTime: string;
}

export interface TitleConfig {
  [id: string]: number[];
}

export interface TitleData {
  titleConfig: TitleConfig;
  data: Title[];
}