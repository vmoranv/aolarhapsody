/**
 * @description 宠物皮肤信息的接口
 * @interface PetSkinInfo
 * @property {number} id - 皮肤 ID
 * @property {string} name - 皮肤名称
 * @property {number} labelId - 标签 ID
 * @property {number} skinId - 皮肤 ID
 * @property {boolean} hasBackground - 是否有背景
 * @property {boolean} showPet - 是否显示宠物
 * @property {boolean} isNormalPet - 是否为普通宠物
 * @property {number[] | null} extendsInfo - 扩展信息
 * @property {string} tuJianId - 图鉴 ID
 * @property {boolean} hasTalk - 是否有对话
 * @property {boolean} isSwitchPackageBG - 是否切换背包背景
 * @property {boolean} isInteractSkin - 是否为互动皮肤
 * @property {boolean} hasInbetweening - 是否有中间动画
 * @property {boolean} isCaiDanSkin - 是否为彩蛋皮肤
 * @property {boolean} hasPackageSkinState - 是否有背包皮肤状态
 * @property {boolean} isFightMusic - 是否有战斗音乐
 * @property {boolean} needVerification - 是否需要验证
 * @property {number[] | null} huanCaiRaceIdArr - 幻彩竞赛 ID 数组
 * @property {boolean} isShowMeInPetSkinBook - 是否在宠物皮肤图鉴中显示
 * @property {boolean} needFullBattle - 是否需要完整战斗
 * @property {boolean} isHuanHuaSkin - 是否为幻化皮肤
 */
export interface PetSkinInfo {
  id: number;
  name: string;
  labelId: number;
  skinId: number;
  hasBackground: boolean;
  showPet: boolean;
  isNormalPet: boolean;
  extendsInfo: number[] | null;
  tuJianId: string;
  hasTalk: boolean;
  isSwitchPackageBG: boolean;
  isInteractSkin: boolean;
  hasInbetweening: boolean;
  isCaiDanSkin: boolean;
  hasPackageSkinState: boolean;
  isFightMusic: boolean;
  needVerification: boolean;
  huanCaiRaceIdArr: number[] | null;
  isShowMeInPetSkinBook: boolean;
  needFullBattle: boolean;
  isHuanHuaSkin: boolean;
}
