/**
 * 表示晶钥
 */
export interface CrystalKey {
  /** 晶钥ID */
  id: number;
  /** 晶钥名称 */
  name: string;
  /** 描述 */
  description: string;
}
/**
 * 定义 crystalkeydata.json 文件中已知的顶级子类
 */
export const CRYSTALKEY_SUBCLASSES = ['data'];
