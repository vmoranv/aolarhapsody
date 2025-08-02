/**
 * 表示召唤师技能的配置
 */
export interface SummonerSkillDataConfig {
  /** 技能的ID */
  id: number;
  /** 技能的名称 */
  name: string;
  /** 技能的描述 */
  desc: string;
  /** 技能的消耗 */
  cost: number;
}

/**
 * 定义 summonerdata.json 文件中已知的顶级子类
 */
export const SUMMONER_SUBCLASSES = [];
