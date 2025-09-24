// --- 依赖导入 ---
// 批量导入各个数据模块中定义的已知子类常量
import { ASTRALSPIRIT_SUBCLASSES } from './astralspirit';
import { CHATFRAME_SUBCLASSES } from './chatframe';
import { CLOTHES_SUBCLASSES } from './clothes';
import { CRYSTALKEY_SUBCLASSES } from './crystalkey';
import { GALAXYFLEETMARK_SUBCLASSES } from './galaxyfleetmark';
import { GODCARD_SUBCLASSES } from './godcard';
import { HEADFRAME_SUBCLASSES } from './headframe';
import { HK_SUBCLASSES } from './hk';
import { HEADICON_SUBCLASSES, PETICON_SUBCLASSES } from './icondata';
import { INSCRIPTION_SUBCLASSES } from './inscription';
import { ITEM_SUBCLASSES } from './item';
import { MIRACLE_SUBCLASSES } from './miracle';
import { PETCARD_SUBCLASSES } from './petcard';
import { PETCARD2_SUBCLASSES } from './petcard2';
import { PETDICTIONARY_SUBCLASSES } from './petdictionary';
import { PETSTONE_SUBCLASSES } from './petstone';
import { PETTALK_SUBCLASSES } from './pettalk';
import { PETTERRITORYFIGHT_SUBCLASSES } from './petterritoryfight';
import { PMDATALIST_SUBCLASSES } from './pmdatalist';
import { PMEVOLINK_SUBCLASSES } from './pmevolink';
import { SUMMONER_SUBCLASSES } from './summoner';
import { TASK_SUBCLASSES } from './task';
import { TITLE_SUBCLASSES } from './title';
import { TOTE_SUBCLASSES } from './tote';
// 导入包含所有目标URL的配置对象
import { URL_CONFIG } from './urlconfig';

/**
 * @description 定义了单个监控源的配置结构。
 * 每个监控源都包含一个目标URL和一组已知的子类名。
 * @interface MonitorSource
 * @property {string} url - 需要监控和爬取数据的目标URL。
 * @property {string[]} knownSubclasses - 一个字符串数组，包含了该数据源下所有已知的、需要处理的子类名称。
 *                                        这些名称通常对应于数据文件中的特定字段或类别。
 */
export interface MonitorSource {
  url: string;
  knownSubclasses: string[];
}

/**
 * @description 全局监控任务配置对象。
 * 这是一个记录(Record)类型的对象，键是监控任务的名称（例如 'astralSpirit', 'chatFrame'），
 * 值是符合 `MonitorSource` 接口的配置对象。
 *
 * 该配置是后端监控服务的核心，它驱动服务去指定的 `url` 获取数据，
 * 并使用 `knownSubclasses` 来解析和处理这些数据。
 * 这种结构使得添加、删除或修改监控任务变得非常简单和清晰。
 */
export const monitorConfig: Record<string, MonitorSource> = {
  // 示例1: 监控星灵数据
  astralSpirit: {
    url: URL_CONFIG.astralSpirit, // 目标URL
    knownSubclasses: ASTRALSPIRIT_SUBCLASSES, // 已知的星灵子类
  },
  // 示例2: 监控聊天框数据
  chatFrame: {
    url: URL_CONFIG.chatFrame,
    knownSubclasses: CHATFRAME_SUBCLASSES,
  },
  clothesData: {
    url: URL_CONFIG.clothesData,
    knownSubclasses: CLOTHES_SUBCLASSES,
  },
  crystalKey: {
    url: URL_CONFIG.crystalKey,
    knownSubclasses: CRYSTALKEY_SUBCLASSES,
  },
  galaxyFleetMark: {
    url: URL_CONFIG.galaxyFleetMark,
    knownSubclasses: GALAXYFLEETMARK_SUBCLASSES,
  },
  godCard: {
    url: URL_CONFIG.godCard,
    knownSubclasses: GODCARD_SUBCLASSES,
  },
  headFrame: {
    url: URL_CONFIG.headFrame,
    knownSubclasses: HEADFRAME_SUBCLASSES,
  },
  hk: {
    url: URL_CONFIG.hk,
    knownSubclasses: HK_SUBCLASSES,
  },
  petIcon: {
    url: URL_CONFIG.petIcon,
    knownSubclasses: PETICON_SUBCLASSES,
  },
  headIcon: {
    url: URL_CONFIG.headIcon,
    knownSubclasses: HEADICON_SUBCLASSES,
  },
  inscription: {
    url: URL_CONFIG.inscription,
    knownSubclasses: INSCRIPTION_SUBCLASSES,
  },
  item: {
    url: URL_CONFIG.item,
    knownSubclasses: ITEM_SUBCLASSES,
  },
  miracle: {
    url: URL_CONFIG.miracle,
    knownSubclasses: MIRACLE_SUBCLASSES,
  },
  petCard: {
    url: URL_CONFIG.petCard,
    knownSubclasses: PETCARD_SUBCLASSES,
  },
  petCard2: {
    url: URL_CONFIG.petCard2,
    knownSubclasses: PETCARD2_SUBCLASSES,
  },
  // 示例3: 监控亚比图鉴数据
  petDictionary: {
    url: URL_CONFIG.petDictionary,
    knownSubclasses: PETDICTIONARY_SUBCLASSES,
  },
  petStone: {
    url: URL_CONFIG.petStone,
    knownSubclasses: PETSTONE_SUBCLASSES,
  },
  petTalk: {
    url: URL_CONFIG.petTalk,
    knownSubclasses: PETTALK_SUBCLASSES,
  },
  petTerritoryFight: {
    url: URL_CONFIG.petTerritoryFight,
    knownSubclasses: PETTERRITORYFIGHT_SUBCLASSES,
  },
  pmDataList: {
    url: URL_CONFIG.pmDataList,
    knownSubclasses: PMDATALIST_SUBCLASSES,
  },
  pmEvoLink: {
    url: URL_CONFIG.pmEvoLink,
    knownSubclasses: PMEVOLINK_SUBCLASSES,
  },
  summoner: {
    url: URL_CONFIG.summoner,
    knownSubclasses: SUMMONER_SUBCLASSES,
  },
  task: {
    url: URL_CONFIG.task,
    knownSubclasses: TASK_SUBCLASSES,
  },
  title: {
    url: URL_CONFIG.title,
    knownSubclasses: TITLE_SUBCLASSES,
  },
  tote: {
    url: URL_CONFIG.tote,
    knownSubclasses: TOTE_SUBCLASSES,
  },
};
