export interface Item {
  id: number;
  name: string;
  type: number;
  price: number;
  rmb: number;
  dailyQuantity: number;
  stackable: boolean;
  sellable: boolean;
  tradeable: boolean;
  maxQuantity: number;
  des: string;
}