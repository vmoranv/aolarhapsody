export interface PetCard {
  cardId: number;
  name: string;
  vip: boolean;
  sale: boolean;
  trade: boolean;
  price: number;
  rmb: number;
  type: number;
  color: number;
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
  suitIds: string; // This seems to be a string like "0,5"
  limitExtAppend: string;
  originCardId: number;
}

export interface PetCardSuit {
  id: number;
  name: string;
  idList: number[];
  dec: string[];
  petIds: number[];
  simpleDec: string[];
  newTipsArr0: string[];
  newTipsArr1: string[];
}