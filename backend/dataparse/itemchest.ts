import { ChestConfig, GiftSultConfig } from '../types/itemchest';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let giftSultConfigCache: Record<string, GiftSultConfig> = {};
let chestConfigCache: Record<string, ChestConfig> = {};

/**
 * 安全地解析一个JS对象字面量字符串
 * @param objString - 要解析的对象字符串
 * @returns 解析后的对象，如果解析失败则返回 null
 */
function sanitizeAndParseObject(objString: string): any {
  // 移除注释和换行符
  let cleanString = objString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/\r?\n|\r/g, '');

  // 为键添加引号
  cleanString = cleanString.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

  // 移除尾随逗号
  cleanString = cleanString.replace(/,(\s*[}\]])/g, '$1');

  try {
    return JSON.parse(cleanString);
  } catch (error) {
    console.error('解析对象时出错:', error, '原始字符串:', objString);
    return null;
  }
}

/**
 * 解析 ItemChest_Config 数据
 * @param jsContent - JavaScript 文件内容
 */
function parseItemChestConfig(jsContent: string) {
  const giftSultRegex = /ItemChest_Config\.GIFT_SULT_CONFIG\[(\d+)\]\s*=\s*(\{[\s\S]*?});/g;
  const chestRegex = /ItemChest_Config\.CHEST_CONFIG\[(\d+)\]\s*=\s*(\{[\s\S]*?});/g;

  let match;

  while ((match = giftSultRegex.exec(jsContent)) !== null) {
    const [, id, configString] = match;
    const config = sanitizeAndParseObject(configString);
    if (config) {
      giftSultConfigCache[id] = config;
    }
  }

  while ((match = chestRegex.exec(jsContent)) !== null) {
    const [, id, configString] = match;
    const config = sanitizeAndParseObject(configString);
    if (config) {
      chestConfigCache[id] = config;
    }
  }
}

/**
 * 获取并缓存宝箱配置数据
 * @returns 包含 GIFT_SULT_CONFIG 和 CHEST_CONFIG 的对象
 */
export async function getItemChestConfig(): Promise<{
  giftSultConfig: Record<string, GiftSultConfig>;
  chestConfig: Record<string, ChestConfig>;
}> {
  if (Object.keys(giftSultConfigCache).length === 0 || Object.keys(chestConfigCache).length === 0) {
    await initItemChestModule();
  }
  return {
    giftSultConfig: giftSultConfigCache,
    chestConfig: chestConfigCache,
  };
}

/**
 * 初始化宝箱配置模块，预先加载和缓存数据
 */
export async function initItemChestModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    parseItemChestConfig(jsContent);
  } catch (error) {
    console.error('初始化宝箱配置模块时出错:', error);
    giftSultConfigCache = {};
    chestConfigCache = {};
  }
}
