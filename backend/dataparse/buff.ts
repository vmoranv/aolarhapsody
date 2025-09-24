import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let buffCache: string[] = [];

/**
 * 安全地清理和解析字符串数组成员
 * @param arrayString - 包含数组内容的字符串
 * @returns 清理和解析后的字符串数组
 */
function sanitizeAndParseArray(arrayString: string): string[] {
  // 移除开头和结尾的方括号
  let cleanedString = arrayString.trim().slice(1, -1);

  // 移除注释
  cleanedString = cleanedString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

  // 按逗号分割，并处理每个元素
  return cleanedString
    .split(',')
    .map((item) => {
      // 移除每个元素周围的空白和引号
      const trimmedItem = item.trim();
      if (trimmedItem.startsWith('"') && trimmedItem.endsWith('"')) {
        return trimmedItem.slice(1, -1);
      }
      if (trimmedItem.startsWith("'") && trimmedItem.endsWith("'")) {
        return trimmedItem.slice(1, -1);
      }
      return trimmedItem; // 对于没有引号的元素
    })
    .filter((item) => item.length > 0); // 过滤掉空字符串
}

/**
 * 获取并缓存 BUFF 数据
 * @returns BUFF 数据数组
 */
export async function getBuffs(): Promise<string[]> {
  if (buffCache.length === 0) {
    await initBuffModule();
  }
  return buffCache;
}

/**
 * 初始化 BUFF 模块，预先加载和缓存数据
 */
export async function initBuffModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    const regex = /ABB_Config\.BUFF\s*=\s*(\[[\s\S]*?\]);/;
    const match = jsContent.match(regex);

    if (match && match[1]) {
      buffCache = sanitizeAndParseArray(match[1]);
    } else {
      throw new Error('在 JS 内容中未找到 ABB_Config.BUFF');
    }
  } catch (error) {
    console.error('初始化 BUFF 模块时出错:', error);
    buffCache = []; // 出错时清空缓存
  }
}
