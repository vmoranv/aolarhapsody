export interface GodCard {
  cardId: number;
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

export interface GodCardSuit {
  id: number;
  suitType: number; // Mapped from index 1 in the example, which is '套装名称' (suit name) but the value is 0. The constructor calls it suitType.
  name: string; // Mapped from index 2 in the example, which is '套装触发条件描述' (trigger condition).
  godCardidList: number[];
  dec: string; // Mapped from index 4 in the example, which is '套装效果描述' (suit effect description).
}