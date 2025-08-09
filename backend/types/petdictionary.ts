export interface EraData {
  idToSystemNameMap: Record<string, string>;
  idToDisplayNameMap: Record<string, string>;
  systemNameToIdMap: Record<string, number>;
}

/**
 * 表示亚比图鉴数据项
 */
export interface PetDictionaryDataItem {
  /** 亚比ID */
  petID: number;
  /** 亚比名称 */
  petName: string;
  /** 亚比身高 */
  petHeight: string;
  /** 亚比体重 */
  petWeight: string;
  /** 防御属性 */
  defAttribute: string;
  /** 攻击属性 */
  attAttribute: string;
  /** 进化等级 */
  evolutionLevel: string;
  /** 是否为新 */
  isNew: string;
  /** 是否稀有 */
  isRare: string;
  /** 位置 */
  loc: string;
  /** 获取方式 */
  getWay: string;
  /** 亚比喜好 */
  petFavourite: string;
  /** 亚比介绍 */
  petIntro: string;
  /** 地点 */
  locations: string;
  /** 是否可获得 */
  securable: string;
  /** 是否为热门亚比 */
  isHotPet: string;
  /** 是否为王者亚比 */
  isKingPet: string;
  /** 是否可评论 */
  canComment: string;
  /** 是否为亚比皮肤 */
  isPetSkin: string;
  /** 皮肤种族ID */
  skinRaceId: string;
  /** 任务ID */
  taskId: string;
  /** 亚比时代信息 */
  petEra?: {
    eraName: 'legend' | 'degenerator' | 'xinghui' | 'gq';
    systemName: string;
    displayName: string;
    typeId: number;
  };
}
/**
 * 定义 petdictionarydata.json 文件中已知的顶级子类
 */
export const PETDICTIONARY_SUBCLASSES = ['data'];
