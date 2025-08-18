export interface PetConfig {
  id: string;
  // Base Config
  raceId: string;
  skillId: string;
  petCards: { id: string; value: string }[];
  otherConfigs: { id: string; name: string; value: string }[];

  // Fetched or Calculated values, not for direct user input in the main form
  panelAttack?: number;
  skillPower?: number;

  // Result
  finalDamage: number | null;
}
