export interface PetTerritoryFight {
  id: number;
  name: string;
  characterDes: string;
  allAreaPowerDes?: string;
  mainAreaPowerDes?: string;
  territoryDetailDes?: string;
  territorySimpleDes?: string;
}

export interface PetTerritoryFetter {
  id: number;
  name: string;
  conditions: string[];
}

export interface PetTerritoryFightData {
  data: Record<number, PetTerritoryFight>;
  fetter: Record<number, PetTerritoryFetter>;
}