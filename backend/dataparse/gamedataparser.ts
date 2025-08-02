import axios from 'axios';
import { monitorConfig } from '../types/monitorconfig';

/**
 * 安全地解析类似JavaScript对象的字符串
 * @param content - 要解析的字符串内容
 * @returns 解析后的对象或数组
 */
function safeParse(content: string) {
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('将字符串解析为JSON时出错:', error);
    throw new Error('无法将字符串解析为JSON请确保数据是有效的JSON格式');
  }
}

/**
 * 从JavaScript文件内容中提取并解析一个字典（对象）
 * @param jsContent - JavaScript文件的完整内容
 * @param dictionaryKey - 要提取的字典的键名（例如 'PMAttributeMap._skillAttributeData'）
 * @returns 解析后的字典数据
 */
export function extractDictionary(jsContent: string, dictionaryKey: string): unknown {
  // 构建一个正则表达式来匹配 "key = { ... }" 或 "key = [ ... ]"
  // 这个正则表达式会寻找变量赋值，并捕获括号内的所有内容
  const keyPath = dictionaryKey.replace(/\./g, '\\.');
  const regex = new RegExp(`${keyPath}\\s*=\\s*(\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\});`);

  const match = jsContent.match(regex);

  if (match && match[1]) {
    const dataString = match[1];
    return safeParse(dataString);
  }

  throw new Error(`在JS内容中未找到键为 "${dictionaryKey}" 的字典`);
}

/**
 * 从给定的URL获取JS文件，并从中提取和解析一个字典
 * @param url - JavaScript文件的URL
 * @param dictionaryKey - 要提取的字典的键名
 * @returns 解析后的字典数据
 */
export async function fetchAndParseDictionary(
  url: string,
  dictionaryKey: string
): Promise<unknown> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }

    const jsContent = response.data;
    return extractDictionary(jsContent, dictionaryKey);
  } catch (error) {
    console.error(`获取或解析字典 "${dictionaryKey}" 时出错:`, error);
    throw error;
  }
}

/**
 * 从给定的URL获取并解析一个JSON文件
 * @param url - JSON文件的URL
 * @returns 解析后的JSON数据
 */
export async function fetchAndParseJSON(url: string): Promise<unknown> {
  try {
    const response = await axios.get(url, {
      responseType: 'text', // 获取原始文本响应
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }

    const responseData = response.data;

    // 根据用户要求，为petTalk数据源强制截断，只解析第一个条目
    if (url === monitorConfig.petTalk.url && typeof responseData === 'string') {
      const firstBrace = responseData.indexOf('{');
      const firstComma = responseData.indexOf(',', firstBrace);
      if (firstBrace !== -1 && firstComma !== -1) {
        // 截取到第一个逗号，并补全右大括号
        const truncatedData = responseData.substring(firstBrace, firstComma) + '}';
        try {
          return JSON.parse(truncatedData);
        } catch (e) {
          console.error('解析截断后的petTalk数据时出错:', e);
          // 如果解析失败，则回退到解析完整数据
          return JSON.parse(responseData);
        }
      }
    }

    // 对于其他URL或非字符串响应，正常解析
    if (typeof responseData === 'string') {
      return JSON.parse(responseData);
    }
    return responseData;
  } catch (error) {
    console.error(`获取或解析JSON时出错:`, error);
    throw error;
  }
}

/**
 * 从给定的URL获取并解析一个JSON文件，并将其转换为指定的类型
 * @param url - JSON文件的URL
 * @returns 解析后的类型化JSON数据
 */
export async function fetchAndParseData<T>(url: string): Promise<T> {
  const data = await fetchAndParseJSON(url);
  return data as T;
}
