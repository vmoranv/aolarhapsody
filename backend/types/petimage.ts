/**
 * 表示亚比图片
 */
export interface PetImage {
  /** 亚比ID */
  id: number;
  /** 图片类型 */
  type: 'small' | 'big' | 'egg';
  /** 图片URL */
  url: string;
}

/**
 * 定义 petimagedata.json 文件中已知的顶级子类
 * 这个模块不直接从JSON文件读取数据，但为了架构一致性，我们定义一个空的子类数组。
 */
export const PETIMAGE_SUBCLASSES = [];
