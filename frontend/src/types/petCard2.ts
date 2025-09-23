export interface PetCard2 {
  id: number;
  name: string;
  trade: boolean;
  vip: number;
  isLimitedTime: boolean;
  price: number;
  rmb: number;
  level: number;
  applyId: number;
  baseExp: number;
  levelExpArea: number[];
  raceList: number[];
  viewId: number;
}

export interface PetCard2Detail {
  cardId: number;
  name: string;
  trade: boolean;
  vip: number;
  isLimitedTime: boolean;
  price: number;
  rmb: number;
  level: number;
  applyId: number;
  baseExp: number;
  levelExpArea: number[] | null;
  raceList: number[];
  viewId: number;
}

export interface PetCard2Description {
  level: number;
  description: string;
}

export interface PetCard2DescriptionsResponse {
  cardId: number;
  descriptions: PetCard2Description[];
}
