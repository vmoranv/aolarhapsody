export interface ToteData {
  id: number;
  name: string;
  color: number;
  type: number;
  baseValue: string;
  effectValue: string;
  advantageValue: string;
  tujianDes: string;
}

export interface ToteEntryData {
  id: number;
  name: string;
  des: string;
}

export interface ToteValueData {
  id: number;
  name: string;
  des: string;
  dataStr: string;
  advantageRadio: number;
}

export interface Tote {
  data: ToteData[];
  entry: ToteEntryData[];
  value: ToteValueData[];
}