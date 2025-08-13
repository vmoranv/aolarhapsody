/**
 * 基础URL配置
 */
const BASE_URL = '/proxy'; // 使用代理
const H5_BASE_URL = `${BASE_URL}/h5`;

/**
 * 游戏内各种数据资源的URL配置对象
 * 集中管理所有外部数据源的URL，方便维护和修改。
 */
export const URL_CONFIG = {
  petIconPrefix: `${H5_BASE_URL}/peticon`,
  petEggPrefix: `${H5_BASE_URL}/petegg`,
  petAttributePrefix: `${H5_BASE_URL}/petattribute`,
  guangqiIconPrefix: `${H5_BASE_URL}/guangqiicon`,
  xinghuiIconPrefix: `${H5_BASE_URL}/xinghuiicon`,
  petSoundPrefix: `${BASE_URL}/play/music/petsound`, // 添加语音路径
};
