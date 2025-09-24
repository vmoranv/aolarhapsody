import { SanctuaryEffect } from '../types/sanctuaryeffects';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let sanctuaryEffectsCache: Record<string, SanctuaryEffect> = {};

/**
 * 安全地清理和解析对象映射
 * @param objString - 包含对象内容的字符串
 * @returns 清理和解析后的对象
 */
function sanitizeAndParseObject(objString: string): Record<string, SanctuaryEffect> {
  // 移除注释
  let jsonString = objString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

  // 移除换行符
  jsonString = jsonString.replace(/\r?\n|\r/g, '');

  // 移除对象和数组中的尾随逗号
  jsonString = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('解析圣域效果对象时出错:', error);
    return {};
  }
}

/**
 * 获取并缓存圣域效果数据
 * @returns 圣域效果数据对象
 */
export async function getSanctuaryEffects(): Promise<Record<string, SanctuaryEffect>> {
  if (Object.keys(sanctuaryEffectsCache).length === 0) {
    await initSanctuaryEffectsModule();
  }
  return sanctuaryEffectsCache;
}

/**
 * 初始化圣域效果模块，预先加载和缓存数据
 */
export async function initSanctuaryEffectsModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    const regex = /NewFightBSConfig\.bsMap\s*=\s*(\{[\s\S]*?\});/;
    const match = jsContent.match(regex);

    if (match && match[1]) {
      sanctuaryEffectsCache = sanitizeAndParseObject(match[1]);
    } else {
      throw new Error('在 JS 内容中未找到 NewFightBSConfig.bsMap');
    }
  } catch (error) {
    console.error('初始化圣域效果模块时出错:', error);
    sanctuaryEffectsCache = {}; // 出错时清空缓存
  }
}
