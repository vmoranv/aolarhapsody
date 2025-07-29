/**
 * 表示一块进化石。
 */
export interface EvolutionStone {
  /** 进化石的ID。 */
  id: number;
  /** 可以进化的亚比的种族ID。 */
  evoRaceId: number;
  /** 进化后亚比的种族ID。 */
  evoToRaceId: number;
  /** 进化的等级限制。 */
  levelLimit: number;
}

/**
 * 表示一块技能石。
 */
export interface SkillStone {
  /** 技能石的ID。 */
  id: number;
  /** 可以使用技能石的亚比的种族ID。 */
  raceId: number;
  /** 技能的ID。 */
  skillId: number;
  /** 使用技能石的等级限制。 */
  levelLimit: number;
}