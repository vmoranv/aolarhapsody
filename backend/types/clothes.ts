export interface Clothes {
  id: number;
  name: string;
  vip: boolean;
  sale: number;
  trade: boolean;
  maxQuantity: number;
  price: number;
  rmb: number;
  type: number;
  recallRmb: number;
  classify: number;
  val: number;
}

export interface ClothesSuit {
  id: number;
  name: string;
  clothesList: number[];
}

export interface ClothesAffectBody {
  clothesId: number;
  bodyPartType: number;
}

export interface ClothesPart {
  id: number;
  description: string;
}