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
import { URL_CONFIG } from './url-config';

export interface MonitorSource {
  url: string;
  knownSubclasses: string[];
  file: string; // 用于标识来源文件
}

export const monitorConfig: Record<string, MonitorSource> = {
  astralSpirit: {
    url: URL_CONFIG.astralSpirit,
    knownSubclasses: ASTRALSPIRIT_SUBCLASSES,
    file: 'astralspirit.ts',
  },
  chatFrame: {
    url: URL_CONFIG.chatFrame,
    knownSubclasses: CHATFRAME_SUBCLASSES,
    file: 'chatframe.ts',
  },
  clothesData: {
    url: URL_CONFIG.clothesData,
    knownSubclasses: CLOTHES_SUBCLASSES,
    file: 'clothes.ts',
  },
  crystalKey: {
    url: URL_CONFIG.crystalKey,
    knownSubclasses: CRYSTALKEY_SUBCLASSES,
    file: 'crystalkey.ts',
  },
  galaxyFleetMark: {
    url: URL_CONFIG.galaxyFleetMark,
    knownSubclasses: GALAXYFLEETMARK_SUBCLASSES,
    file: 'galaxyfleetmark.ts',
  },
  godCard: {
    url: URL_CONFIG.godCard,
    knownSubclasses: GODCARD_SUBCLASSES,
    file: 'godcard.ts',
  },
  headFrame: {
    url: URL_CONFIG.headFrame,
    knownSubclasses: HEADFRAME_SUBCLASSES,
    file: 'headframe.ts',
  },
  hk: {
    url: URL_CONFIG.hk,
    knownSubclasses: HK_SUBCLASSES,
    file: 'hk.ts',
  },
  petIcon: {
    url: URL_CONFIG.petIcon,
    knownSubclasses: PETICON_SUBCLASSES,
    file: 'icondata.ts',
  },
  headIcon: {
    url: URL_CONFIG.headIcon,
    knownSubclasses: HEADICON_SUBCLASSES,
    file: 'icondata.ts',
  },
  inscription: {
    url: URL_CONFIG.inscription,
    knownSubclasses: INSCRIPTION_SUBCLASSES,
    file: 'inscription.ts',
  },
  item: {
    url: URL_CONFIG.item,
    knownSubclasses: ITEM_SUBCLASSES,
    file: 'item.ts',
  },
  miracle: {
    url: URL_CONFIG.miracle,
    knownSubclasses: MIRACLE_SUBCLASSES,
    file: 'miracle.ts',
  },
  petCard: {
    url: URL_CONFIG.petCard,
    knownSubclasses: PETCARD_SUBCLASSES,
    file: 'petcard.ts',
  },
  petCard2: {
    url: URL_CONFIG.petCard2,
    knownSubclasses: PETCARD2_SUBCLASSES,
    file: 'petcard2.ts',
  },
  petDictionary: {
    url: URL_CONFIG.petDictionary,
    knownSubclasses: PETDICTIONARY_SUBCLASSES,
    file: 'petdictionary.ts',
  },
  petStone: {
    url: URL_CONFIG.petStone,
    knownSubclasses: PETSTONE_SUBCLASSES,
    file: 'petstone.ts',
  },
  petTalk: {
    url: URL_CONFIG.petTalk,
    knownSubclasses: PETTALK_SUBCLASSES,
    file: 'pettalk.ts',
  },
  petTerritoryFight: {
    url: URL_CONFIG.petTerritoryFight,
    knownSubclasses: PETTERRITORYFIGHT_SUBCLASSES,
    file: 'petterritoryfight.ts',
  },
  pmDataList: {
    url: URL_CONFIG.pmDataList,
    knownSubclasses: PMDATALIST_SUBCLASSES,
    file: 'pmdatalist.ts',
  },
  pmEvoLink: {
    url: URL_CONFIG.pmEvoLink,
    knownSubclasses: PMEVOLINK_SUBCLASSES,
    file: 'pmevolink.ts',
  },
  summoner: {
    url: URL_CONFIG.summoner,
    knownSubclasses: SUMMONER_SUBCLASSES,
    file: 'summoner.ts',
  },
  task: {
    url: URL_CONFIG.task,
    knownSubclasses: TASK_SUBCLASSES,
    file: 'task.ts',
  },
  title: {
    url: URL_CONFIG.title,
    knownSubclasses: TITLE_SUBCLASSES,
    file: 'title.ts',
  },
  tote: {
    url: URL_CONFIG.tote,
    knownSubclasses: TOTE_SUBCLASSES,
    file: 'tote.ts',
  },
};
