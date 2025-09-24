import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let preCache: string[] = [];
let posCache: string[] = [];

/**
 * 解析 RecommendNameConfig 数据
 * @param jsContent - JavaScript 文件内容
 */
function parseRecommendNameConfig(jsContent: string) {
  const preRegex = /RecommendNameConfig\.pre\s*=\s*(\[[\s\S]*?\]);/;
  const posRegex = /RecommendNameConfig\.pos\s*=\s*(\[[\s\S]*?\]);/;

  const preMatch = jsContent.match(preRegex);
  if (preMatch && preMatch[1]) {
    try {
      preCache = JSON.parse(preMatch[1]);
    } catch (error) {
      console.error('解析 RecommendNameConfig.pre 时出错:', error);
    }
  }

  const posMatch = jsContent.match(posRegex);
  if (posMatch && posMatch[1]) {
    try {
      posCache = JSON.parse(posMatch[1]);
    } catch (error) {
      console.error('解析 RecommendNameConfig.pos 时出错:', error);
    }
  }
}

/**
 * 获取并缓存推荐名称配置数据
 * @returns 包含 pre 和 pos 的对象
 */
export async function getRecommendNameConfig(): Promise<{
  pre: string[];
  pos: string[];
}> {
  if (preCache.length === 0 || posCache.length === 0) {
    await initRecommendNameModule();
  }
  return {
    pre: preCache,
    pos: posCache,
  };
}

/**
 * 初始化推荐名称模块，预先加载和缓存数据
 */
export async function initRecommendNameModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    parseRecommendNameConfig(jsContent);
  } catch (error) {
    console.error('初始化推荐名称模块时出错:', error);
    preCache = [];
    posCache = [];
  }
}
