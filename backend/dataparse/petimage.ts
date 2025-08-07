import { URL_CONFIG } from '../types/urlconfig';

/**
 * 获取亚比图片URL
 * 根据亚比ID和图片类型生成对应的图片URL
 *
 * @param {string|number} id - 亚比ID
 * @param {string} type - 图片类型 ('small'|'big'|'egg')
 * @returns {string} 图片URL
 */
export async function initPetImageModule(): Promise<boolean> {
  // 这个模块不需要从外部获取数据，因此初始化函数是空的。
  // 它的存在是为了保持与项目中其他数据解析模块的架构一致性。
  return true;
}

export function getPetImageUrl(id: string | number, type: string = 'small'): string {
  if (!id) {
    console.error('getPetImageUrl: ID不能为空');
    return '';
  }

  try {
    // 处理特殊ID格式
    const processedId = id.toString().replace('_0', '');
    const numId = Number(processedId);

    // 检查ID是否在有效范围内
    if (numId < 1 || numId > 9999) {
      console.warn(`ID ${processedId} 超出有效范围 (1-9999)`);
    }

    switch (type) {
      case 'big':
        // 大图URL
        if (numId >= 4399) {
          // 4399及以上使用新格式
          return `${URL_CONFIG.petIconPrefix}/newlarge/type1/peticon${numId}/peticon${numId}_1.png`;
        } else if (numId > 3923) {
          // 3924-4398使用e目录
          return `${URL_CONFIG.petIconPrefix}/big/e/peticon${numId}.png`;
        } else {
          // 1-3923使用普通目录
          return `${URL_CONFIG.petIconPrefix}/big/peticon${numId}.png`;
        }

      case 'small':
        // 小图URL
        if (numId >= 4399) {
          // 4399及以上使用新格式
          return `${URL_CONFIG.petIconPrefix}/newlarge/type1/peticon${numId}/peticon${numId}_0.png`;
        } else {
          // 1-4398使用普通格式
          return `${URL_CONFIG.petIconPrefix}/small/peticon${numId}.png`;
        }

      case 'egg':
        // 蛋图URL
        return `${URL_CONFIG.petEggPrefix}/egg${numId}.png`;

      default:
        return `${URL_CONFIG.petIconPrefix}/small/peticon${numId}.png`;
    }
  } catch (error) {
    console.error('getPetImageUrl出错:', error);
    return '';
  }
}
