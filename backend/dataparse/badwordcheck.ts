import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let badWordsCache: (string | RegExp)[] = [];

function sanitizeJsonString(jsonString: string): string {
  const lines = jsonString
    .replace(/'/g, '"') // 将单引号替换为双引号
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//')) // 移除空行和注释
    .map((line) => line.replace(/,$/, '')) // 移除行尾的逗号
    .filter((line) => line.length > 0);

  if (lines.length <= 2) {
    return lines.join('');
  }

  // 移除开头和结尾的括号
  const contentLines = lines.slice(1, -1);
  const sanitizedContent = contentLines.join(',');

  return `[${sanitizedContent}]`;
}

/**
 * 从 main.js 中获取并缓存敏感词
 * @returns {Promise<boolean>} 如果成功获取并缓存数据则返回 true，否则返回 false
 */
export async function fetchAndCacheBadWords(): Promise<boolean> {
  if (badWordsCache.length > 0) {
    return true; // 已经缓存过数据
  }

  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);

    const processMatch = (match: RegExpMatchArray | null, context: string) => {
      if (match && match[1]) {
        const sanitizedString = sanitizeJsonString(match[1]);
        try {
          const words = JSON.parse(sanitizedString);
          badWordsCache.push(...words);
        } catch (e) {
          console.error(`解析 ${context} 失败:`, e);
        }
      }
    };

    // 提取 BadWordsFilter._userDefSensiveDicts
    const regex1 = /BadWordsFilter\._userDefSensiveDicts\s*=\s*(\[[\s\S]*?\]);/;
    processMatch(jsContent.match(regex1), 'BadWordsFilter._userDefSensiveDicts');

    // 提取 ForbiddenWordChecker.forbiddenList
    const regex2 = /ForbiddenWordChecker\.forbiddenList\s*=\s*(\[[\s\S]*?\]);/;
    processMatch(jsContent.match(regex2), 'ForbiddenWordChecker.forbiddenList');

    // 提取包含正则表达式的词库
    const regex3 = /this\.list\s*=\s*(\[[\s\S]*?\]);/g;
    let match3;
    while ((match3 = regex3.exec(jsContent)) !== null) {
      processMatch(match3, 'this.list (全局)');
    }

    // 提取 constructor 中的词库
    const regex4 = /constructor\(\)\s*\{\s*this\.list\s*=\s*(\[[\s\S]*?\]);/g;
    let match4;
    while ((match4 = regex4.exec(jsContent)) !== null) {
      processMatch(match4, 'this.list (constructor)');
    }

    // 转换包含 * 的字符串为正则表达式
    badWordsCache = badWordsCache.map((word) => {
      if (typeof word === 'string' && word.includes('.*')) {
        return new RegExp(word, 'i');
      }
      return word;
    });

    // 去重
    const uniqueWords = new Set();
    badWordsCache = badWordsCache.filter((item) => {
      const value = item instanceof RegExp ? item.toString() : item;
      if (uniqueWords.has(value)) {
        return false;
      }
      uniqueWords.add(value);
      return true;
    });

    return true;
  } catch (error) {
    console.error('获取敏感词数据时出错:', error);
    return false;
  }
}

/**
 * 检查文本是否包含敏感词
 * @param {string} text - 要检查的文本
 * @returns {boolean} 如果包含敏感词则返回 true，否则返回 false
 */
export function checkBadWords(text: string): boolean {
  if (badWordsCache.length === 0) {
    console.warn('敏感词库尚未初始化');
    return false;
  }

  for (const word of badWordsCache) {
    if (word instanceof RegExp && word.test(text)) {
      return true;
    } else if (typeof word === 'string' && text.includes(word)) {
      return true;
    }
  }

  return false;
}
