export interface PetImages {
  bigImage: string;
  smallImage: string;
  eggImage: string;
}

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
  return `/api/petimage/${type}/${id}`;
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
