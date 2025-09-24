import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

interface CommonBuff {
  id: number;
  tips: string;
  detailTips: string;
  type: number;
  simpleTips: string;
  defaultValue: string;
}

let commonBuffCache: Record<string, CommonBuff> = {};

/**
 * 解析 CommonBuffData.data 数据
 * @param jsContent - JavaScript 文件内容
 */
function parseCommonBuffData(jsContent: string) {
  const regex = /CommonBuffData\.data\s*=\s*(\{[\s\S]*?\});/;
  const match = jsContent.match(regex);

  if (match && match[1]) {
    const dataString = match[1];
    // 这个解析比较复杂，因为它涉及到 `new _CommonBuff__WEBPACK_IMPORTED_MODULE_0__["default"](...)`
    // 我们需要用正则表达式提取每个 buff 的参数
    const buffRegex =
      /"(\d+)"\s*:\s*new\s*.*?\((\d+),\s*"(.*?)",\s*"(.*?)",\s*(\d+),\s*"(.*?)",\s*"(.*?)"\)/g;
    let buffMatch;
    while ((buffMatch = buffRegex.exec(dataString)) !== null) {
      const [, id, _id, tips, detailTips, type, simpleTips, defaultValue] = buffMatch;
      commonBuffCache[id] = {
        id: parseInt(_id, 10),
        tips,
        detailTips,
        type: parseInt(type, 10),
        simpleTips,
        defaultValue,
      };
    }
  }
}

/**
 * 获取并缓存通用 Buff 数据
 * @returns 通用 Buff 数据对象
 */
export async function getCommonBuffs(): Promise<Record<string, CommonBuff>> {
  if (Object.keys(commonBuffCache).length === 0) {
    await initCommonBuffModule();
  }
  return commonBuffCache;
}

/**
 * 初始化通用 Buff 模块，预先加载和缓存数据
 */
export async function initCommonBuffModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    parseCommonBuffData(jsContent);
  } catch (error) {
    console.error('初始化通用 Buff 模块时出错:', error);
    commonBuffCache = {};
  }
}
