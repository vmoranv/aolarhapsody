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
