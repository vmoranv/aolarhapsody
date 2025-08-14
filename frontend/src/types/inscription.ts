export interface Inscription {
  id: number;
  name: string;
  price: number;
  rmb: number;
  inscriptionType: number;
  level: number;
  preLevelId: number;
  nextLevelId: number;
  desc: string;
}

export interface InscriptionSuit {
  id: number;
  name: string;
  inscriptionIdList: number[];
  dec: string;
}
