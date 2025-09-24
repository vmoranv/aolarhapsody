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
