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
  subtype?: number;
  price?: number;
  rmb?: number;
  dailyQuantity?: number;
  sale?: boolean;
  vip?: boolean;
  trade?: boolean;
  maxQuantity?: number;
  hpInc?: number;
  attackInc?: number;
  defendInc?: number;
  sAttackInc?: number;
  sDefendInc?: number;
  speedInc?: number;
  suitId?: number;
  strengthType?: number;
  limitDate?: string;
}

export interface AstralSpiritSuit {
  id: number;
  suitType: number;
  name: string;
  astralSpiritIdList: number[];
  dec: string;
  surIds?: number[];
  activeNeed?: number;
  suitEffectDes?: string;
  oneShenhuaSuitEffectDes?: string;
  threeShenHuaSuitEffectDes?: string;
}
