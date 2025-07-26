export interface PetImages {
  bigImage: string;
  smallImage: string;
  eggImage: string;
}

const BASE_URL = 'https://aola.100bt.com/h5';

/**
 * 获取亚比图片URL
 */
export function getPetImageUrl(
  id: string | number,
  type: 'small' | 'big' | 'egg' = 'small'
): string {
  if (!id) {
    console.error('getPetImageUrl: ID不能为空');
    return '';
  }

  try {
    const processedId = id.toString().replace('_0', '');
    const numId = Number(processedId);

    if (numId < 1 || numId > 9999) {
      // 1-9999之间的petid才是有效的图鉴亚比
    }

    switch (type) {
      case 'big':
        if (numId >= 4399) {
          return `${BASE_URL}/peticon/newlarge/type1/peticon${numId}/peticon${numId}_1.png`;
        } else if (numId > 3923) {
          return `${BASE_URL}/peticon/big/e/peticon${numId}.png`;
        } else {
          return `${BASE_URL}/peticon/big/peticon${numId}.png`;
        }

      case 'small':
        if (numId >= 4399) {
          return `${BASE_URL}/peticon/newlarge/type1/peticon${numId}/peticon${numId}_0.png`;
        } else {
          return `${BASE_URL}/peticon/small/peticon${numId}.png`;
        }

      case 'egg':
        return `${BASE_URL}/petegg/egg${numId}.png`;

      default:
        return `${BASE_URL}/peticon/small/peticon${numId}.png`;
    }
  } catch (error) {
    console.error('getPetImageUrl出错:', error);
    return '';
  }
}

/**
 * 获取所有类型的亚比图片URL
 */
export function getPetImageUrls(id: string | number): PetImages {
  return {
    bigImage: getPetImageUrl(id, 'big'),
    smallImage: getPetImageUrl(id, 'small'),
    eggImage: getPetImageUrl(id, 'egg'),
  };
}
