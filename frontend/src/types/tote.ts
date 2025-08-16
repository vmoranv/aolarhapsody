export interface Tote {
  id: number;
  name: string;
  type: number;
  quality: number;
  price: number;
  rmb: number;
  level: number;
  desc: string;
  category: string;
  rarity: number;
}

export interface ToteDetail {
  id: number;
  name: string;
  color: number;
  type: number;
  baseValue: string;
  effectValue: string;
  advantageValue: string;
  tujianDes: string;
}

export interface ToteEntry {
  id: number;
  name: string;
  des: string;
}
