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
import { URL_CONFIG } from './urlconfig';

export interface MonitorSource {
  url: string;
  knownSubclasses: string[];
}

export const monitorConfig: Record<string, MonitorSource> = {
  astralSpirit: {
    url: URL_CONFIG.astralSpirit,
    knownSubclasses: ASTRALSPIRIT_SUBCLASSES,
  },
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
