/**
 * 表示亚比的对话数据
 */
export interface PetTalk {
  /** 亚比的种族ID */
  raceId: number;
  /** 对话内容 */
  talk: string;
}

/**
 * 定义 pettalkdata.json 文件中已知的顶级子类
 */
export const PETTALK_SUBCLASSES = [];
