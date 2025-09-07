import { URL_CONFIG } from '../types/url';

/**
 * 获取晶钥图片URL
 * @param id 晶钥ID
 * @returns 图片的URL
 */
export function getCrystalKeyImageUrl(id: string | number): string {
  if (!id) {
    console.error('getCrystalKeyImageUrl: ID不能为空');
    return '';
  }

  try {
    const processedId = id.toString();
    return `${URL_CONFIG.crystalKeyPrefix}/crystalkeyview_${processedId}.png`;
  } catch (error) {
    console.error('getCrystalKeyImageUrl出错:', error);
    return '';
  }
}

const GOD_CARD_VIEW_TYPES = [
  'real', // 实卡
  'virtual', // 虚卡
  'large', // 大图
];

/**
 * 获取普通星灵图片URL
 * @param id 星灵ID
 * @param level 等级 (默认为1)
 * @returns 图片的URL
 */
export function getAstralSpiritImageUrl(id: string | number, level: number = 1): string {
  if (!id) {
    console.error('getAstralSpiritImageUrl: ID不能为空');
    return '';
  }
  return `${URL_CONFIG.astralSpiritPrefix}/icon/view${id}_${level}.png`;
}

/**
 * 获取星灵套装图片URL
 * @param id 套装ID
 * @returns 图片的URL
 */
export function getAstralSpiritSuitImageUrl(id: string | number): string {
  if (!id) {
    console.error('getAstralSpiritSuitImageUrl: ID不能为空');
    return '';
  }
  return `${URL_CONFIG.astralSpiritPrefix}/icon/suitview${id}.png`;
}

/**
 * 获取神兵套装图片URL
 * @param id 套装ID
 * @param firstGodCardId 第一个神兵ID
 * @returns 图片的URL
 */
export function getGodCardSuitImageUrl(id: string | number, firstGodCardId?: number): string {
  if (!id) {
    console.error('getGodCardSuitImageUrl: ID不能为空');
    return '';
  }

  // 如果提供了第一个神兵ID，则使用它来生成URL
  if (firstGodCardId) {
    return `${URL_CONFIG.godCardPrefix}/real/view${firstGodCardId}.png`;
  }

  // 否则使用套装ID
  return `${URL_CONFIG.godCardPrefix}/real/view${id}.png`;
}

/**
 * 获取神兵图片URL
 * @param card 当前卡牌对象
 * @param allCards 所有卡牌的列表
 * @param viewType 视图类型 (0: 实卡, 1: 虚卡, 2: 大图), 默认为0
 * @returns 图片的URL
 */
export function getGodCardImageUrl(
  card: { id: string | number; name: string },
  allCards: { id: string | number; name: string }[],
  viewType: number = 0
): string {
  if (!card || !card.id) {
    console.error('getGodCardImageUrl: 卡牌或卡牌ID不能为空');
    return '';
  }

  let imageId = card.id;

  // 如果卡牌名称包含LV，则查找基础卡牌
  if (card.name && card.name.includes('LV')) {
    const baseName = card.name.replace(/LV\d+$/, '').trim();
    const baseCard = allCards.find((c) => c.name === baseName && !c.name.includes('LV'));
    if (baseCard) {
      imageId = baseCard.id;
    }
  }

  const type = GOD_CARD_VIEW_TYPES[viewType] || GOD_CARD_VIEW_TYPES[0];
  return `${URL_CONFIG.godCardPrefix}/${type}/view${imageId}.png`;
}

/**
 * 获取魂卡图片URL
 * @param id 魂卡ID
 * @param size 尺寸 (0: 大, 1: 中, 2: 小, 3: 头像), 默认为2 (小)
 * @returns 图片的URL
 */
export function getHKImageUrl(id: string | number, size: number = 2): string {
  if (!id) {
    console.error('getHKImageUrl: ID不能为空');
    return '';
  }
  const sizeSuffixes = ['l', 'm', 'h', 'h']; // 尺寸后缀，头像也用'h'
  const suffix = sizeSuffixes[size] || sizeSuffixes[2];
  return `${URL_CONFIG.hkPrefix}/view/hkview_${id}_${suffix}.png`;
}

/**
 * 获取铭文图片URL
 * @param id 铭文ID
 * @returns 图片的URL
 */
export function getInscriptionImageUrl(id: string | number): string {
  if (!id) {
    console.error('getInscriptionImageUrl: ID不能为空');
    return '';
  }
  return `${URL_CONFIG.inscriptionPrefix}/icon/view${id}.png`;
}

const PETCARD_SPECIAL_MAP: { [key: number]: string } = {
  1: '0_0',
  2: '1_0',
  3: '2_0',
  4: '2_0',
  5: '2_0',
  6: '3_0',
  7: '0_1',
  8: '1_1',
  9: '2_1',
  10: '2_1',
  11: '3_1',
  12: '3_1',
  13: '2_1',
  14: '2_1',
  15: '3_1',
  16: '0_2',
  17: '1_1',
  18: '2_1',
  19: '2_1',
  20: '3_1',
  21: '3_1',
  22: '3_2',
  23: '3_2',
  24: '1_2',
  25: '2_1',
  26: '2_1',
  27: '3_1',
  28: '3_1',
  29: '3_2',
  30: '0_2',
  31: '3_2',
  32: '3_2',
  33: '2_2',
  34: '3_1',
  35: '3_1',
  36: '2_2',
  37: '2_2',
  38: '2_2',
  39: '2_2',
  40: '3_3',
  49: '1_3',
  57: '2_3',
};

/**
 * 获取PetCard图片URL
 * @param card 当前卡牌对象
 * @param allCards 所有卡牌的列表
 * @returns 图片的URL
 */
export function getPetCardImageUrl(
  card: { id: number; name: string; viewId: number },
  allCards: { id: number; name: string; viewId: number }[]
): string {
  if (!card) {
    console.error('getPetCardImageUrl: card不能为空');
    return '';
  }

  // 特殊处理
  const typeAndColor = PETCARD_SPECIAL_MAP[card.id];
  if (typeAndColor) {
    return `${URL_CONFIG.petCardPrefix}/icon/type${typeAndColor}.png`;
  }

  let imageId = card.viewId;

  // 如果卡牌名称包含LV，则查找基础卡牌
  if (card.name && card.name.includes('LV')) {
    const baseName = card.name.replace(/LV\d+$/, '').trim();
    const baseCard = allCards.find((c) => c.name === baseName && !c.name.includes('LV'));
    if (baseCard) {
      imageId = baseCard.viewId;
    }
  }

  // 优先使用viewId（如果存在且有效），否则回退到id
  const finalId = imageId !== undefined && imageId !== -1 ? imageId : card.id;

  if (finalId !== undefined) {
    return `${URL_CONFIG.petCardPrefix}/icon/view${finalId}.png`;
  }

  console.warn('getPetCardImageUrl: 无法为卡片确定有效的图片ID', card);
  return '';
}

/**
 * 获取PetCard2图片URL
 * @param id PetCard2的ID
 * @returns 图片的URL
 */
export function getPetCard2ImageUrl(id: string | number): string {
  if (!id) {
    console.error('getPetCard2ImageUrl: ID不能为空');
    return '';
  }

  let imageId = Number(id);
  if (imageId >= 7 && imageId <= 74) {
    imageId = 5;
  }

  return `${URL_CONFIG.petCard2Prefix}/icon/view${imageId}.png`;
}

/**
 * 获取魂器图片URL
 * @param id 魂器ID
 * @param isBigImg 是否为大图, 默认为false
 * @returns 图片的URL
 */
export function getToteImageUrl(id: string | number, isBigImg: boolean = false): string {
  if (!id) {
    console.error('getToteImageUrl: ID不能为空');
    return '';
  }
  const prefix = isBigImg ? 'toteview_big_' : 'toteview_';
  return `${URL_CONFIG.totePrefix}/view/${prefix}${id}.png`;
}
