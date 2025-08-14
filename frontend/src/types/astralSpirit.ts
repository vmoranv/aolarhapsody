export interface AstralSpirit {
  id: string;
  name: string;
  type: number;
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

export interface AstralSpiritSuit {
  id: number;
  suitType: number;
  name: string;
  astralSpiritIdList: number[];
  dec: string;
}
