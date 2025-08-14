export interface HKData {
  id: number;
  name: string;
  color: number;
  wordBar: string;
  produceType: number;
}

export interface HKBuff {
  id: number;
  name: string;
  decs: string[];
  costs: number[];
  fontColor: string;
  color: number;
  buffNames: string[];
  values: string[];
}
