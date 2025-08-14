import { DataItem } from './DataItem';

export interface GodCard extends DataItem {
  cardId: number;
  quality: number;
  hp: number;
  speed: number;
  attack: number;
  defend: number;
  sAttack: number;
  sDefend: number;
  desc: string;
  limitRaceId: number[];
  viewId: number;
  level: number;
  levelUpId: number;
  synthesisType: number;
  limitExtAppend: null;
  originCardId: number;
}

export interface GodCardSuit extends DataItem {
  suitType: number;
  godCardidList: number[];
  dec: string;
}
