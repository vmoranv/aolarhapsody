export interface PetCard {
  id: number;
  name: string;
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
