/**
 * @file 海报相关类型定义
 * @description 用于定义海报数据的TypeScript类型。
 */

/**
 * 表示单个海报的完整信息
 */
export interface Poster extends RawPosterData {
  labelName: string;
  url: string;
}

/**
 * 表示简化的海报信息，用于列表显示
 */
export interface SimplifiedPoster {
  id: number;
  name: string;
  labelName: string;
  url: string;
}

/**
 * 表示从gamemain.js中原始提取的海报信息
 */
export interface RawPosterData {
  id: number;
  name: string;
  labelId: number;
  skinId: string;
  hasBackground: boolean;
  showPet: boolean;
  hasTalk: boolean;
  extendsInfo: number[];
  description: string;
  isNormalPet: boolean;
  isSwitchPackageBG: boolean;
  isInteractSkin: boolean;
  needVerification: boolean;
  isFightMusic: boolean;
  isHuanDong: boolean;
  hasPackageSkinState: boolean;
}
