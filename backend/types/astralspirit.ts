export interface AstralSpirit {
  id: number;
  name: string;
  subtype: number;
  price: number;
  rmb: number;
  dailyQuantity: number;
  sale: boolean;
  vip: boolean;
  trade: boolean;
  maxQuantity: number;
  hp: number;
  attack: number;
  defend: number;
  sAttack: number;
  sDefend: number;
  speed: number;
  hpInc: number;
  attackInc: number;
  defendInc: number;
  sAttackInc: number;
  sDefendInc: number;
  speedInc: number;
  suitId: number;
  strengthType: number;
  limitDate: string;
}

export interface AstralSpiritSuit {
  id: number;
  name: string;
  surIds: number[];
  activeNeed: number;
  suitEffectDes: string;
  oneShenhuaSuitEffectDes: string;
  threeShenHuaSuitEffectDes: string;
}