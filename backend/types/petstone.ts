export interface EvolutionStone {
  id: number;
  evoRaceId: number;
  evoToRaceId: number;
  levelLimit: number;
}

export interface SkillStone {
  id: number;
  raceId: number;
  skillId: number;
  levelLimit: number;
}