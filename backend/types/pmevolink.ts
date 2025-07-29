/**
 * 表示特殊进化。
 */
export interface SpEvo {
  /** 进化前的种族ID。 */
  beforeRaceId: number;
  /** 进化后的种族ID。 */
  afterRaceId: number;
  /** 进化类型。 */
  evoType: number;
}