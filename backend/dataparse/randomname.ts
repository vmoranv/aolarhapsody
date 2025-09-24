import { NameCombination } from '../types/randomname';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let nameCombination1Cache: NameCombination[] = [];
let nameCombination2Cache: NameCombination[] = [];

/**
 * 解析 RandomNameConfig 数据
 * @param jsContent - JavaScript 文件内容
 */
function parseRandomNameConfig(jsContent: string) {
  const combination1Regex = /RandomNameConfig\.NAME_COMBINATION_1\s*=\s*(\[[\s\S]*?\]);/;
  const combination2Regex = /RandomNameConfig\.NAME_COMBINATION_2\s*=\s*(\[[\s\S]*?\]);/;

  const match1 = jsContent.match(combination1Regex);
  if (match1 && match1[1]) {
    try {
      nameCombination1Cache = JSON.parse(match1[1]);
    } catch (error) {
      console.error('解析 NAME_COMBINATION_1 时出错:', error);
    }
  }

  const match2 = jsContent.match(combination2Regex);
  if (match2 && match2[1]) {
    try {
      nameCombination2Cache = JSON.parse(match2[1]);
    } catch (error) {
      console.error('解析 NAME_COMBINATION_2 时出错:', error);
    }
  }
}

/**
 * 获取并缓存随机名称配置数据
 * @returns 包含 NAME_COMBINATION_1 和 NAME_COMBINATION_2 的对象
 */
export async function getRandomNameConfig(): Promise<{
  nameCombination1: NameCombination[];
  nameCombination2: NameCombination[];
}> {
  if (nameCombination1Cache.length === 0 || nameCombination2Cache.length === 0) {
    await initRandomNameModule();
  }
  return {
    nameCombination1: nameCombination1Cache,
    nameCombination2: nameCombination2Cache,
  };
}

/**
 * 初始化随机名称模块，预先加载和缓存数据
 */
export async function initRandomNameModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    parseRandomNameConfig(jsContent);
  } catch (error) {
    console.error('初始化随机名称模块时出错:', error);
    nameCombination1Cache = [];
    nameCombination2Cache = [];
  }
}
