import { Fetter } from '../types/fetter';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let fetterCache: Fetter[] = [];

/**
 * 解析 FetterConfig.FETTER_CONFIGS 数据
 * @param jsContent - JavaScript 文件内容
 */
function parseFetterConfig(jsContent: string) {
  const regex = /FetterConfig\.FETTER_CONFIGS\s*=\s*(\[[\s\S]*?\]);/;
  const match = jsContent.match(regex);

  if (match && match[1]) {
    const dataString = match[1];
    const fetterRegex =
      /new\s*.*?\((\d+),\s*.*?\["default"\]\.(\w+),\s*"([^"]+)",\s*(\[[\d,\s]*\]),\s*(\[".*?"(?:,\s*".*?")*\])\)/g;
    let fetterMatch;
    fetterCache = []; // Clear cache before parsing

    while ((fetterMatch = fetterRegex.exec(dataString)) !== null) {
      const [, id, typeStr, name, conditionsStr, descsStr] = fetterMatch;
      try {
        fetterCache.push({
          id: parseInt(id, 10),
          type: typeStr,
          name,
          conditions: JSON.parse(conditionsStr),
          descs: JSON.parse(descsStr),
        });
      } catch (error) {
        console.error('解析 Fetter 数据时出错:', error, {
          id,
          typeStr,
          name,
          conditionsStr,
          descsStr,
        });
      }
    }
  }
}

/**
 * 获取并缓存羁绊数据
 * @returns 羁绊数据数组
 */
export async function getFetters(): Promise<Fetter[]> {
  if (fetterCache.length === 0) {
    await initFetterModule();
  }
  return fetterCache;
}

/**
 * 初始化羁绊模块，预先加载和缓存数据
 */
export async function initFetterModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    parseFetterConfig(jsContent);
  } catch (error) {
    console.error('初始化羁绊模块时出错:', error);
    fetterCache = [];
  }
}
