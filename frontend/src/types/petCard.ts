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
  suitType: number;
  name: string;
  petCardIdList: number[];
  dec: string;
}
