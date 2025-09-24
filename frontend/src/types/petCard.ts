/**
 * @description 宠物卡片数据接口
 * @property {number} id - ID
 * @property {string} name - 名称
 * @property {number} quality - 品质
 * @property {number} hp - 生命值
 * @property {number} speed - 速度
 * @property {number} attack - 攻击
 * @property {number} defend - 防御
 * @property {number} sAttack - 特殊攻击
 * @property {number} sDefend - 特殊防御
 * @property {string} desc - 描述
 * @property {number[]} limitRaceId - 限制种族 ID
 * @property {number} viewId - 视图 ID
 * @property {number} level - 等级
 * @property {number} levelUpId - 升级 ID
 * @property {number} synthesisType - 合成类型
 * @property {null} limitExtAppend - 限制扩展附加
 * @property {number} originCardId - 原始卡片 ID
 */
export interface PetCard {
  id: number;
  name: string;
  quality: number;
  hp: number;
  speed: number;
  attack: number;
  defend: number;
  sAttack: number;
  sDefend: number;
  desc: string;
  limitRaceId: number[];
  viewId: number;
  level: number;
  levelUpId: number;
  synthesisType: number;
  limitExtAppend: null;
  originCardId: number;
}

/**
 * @description 宠物卡片套装数据接口
 * @property {number} id - ID
 * @property {string} name - 名称
 * @property {number[]} idList - ID 列表
 * @property {string[]} dec - 描述
 * @property {number[]} petIds - 宠物 ID
 * @property {string[]} simpleDec - 简单描述
 * @property {string[]} newTipsArr0 - 新提示数组 0
 * @property {string[]} newTipsArr1 - 新提示数组 1
 */
export interface PetCardSuit {
  id: number;
  name: string;
  idList: number[];
  dec: string[];
  petIds: number[];
  simpleDec: string[];
  newTipsArr0: string[];
  newTipsArr1: string[];
}
