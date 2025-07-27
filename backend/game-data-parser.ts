import axios from 'axios';

/**
 * 安全地解析类似JavaScript对象的字符串。
 * @param content - 要解析的字符串内容。
 * @returns 解析后的对象或数组。
 */
function safeParse(content: string) {
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("将字符串解析为JSON时出错:", error);
    throw new Error("无法将字符串解析为JSON。请确保数据是有效的JSON格式。");
  }
}

/**
 * 从JavaScript文件内容中提取并解析一个字典（对象）。
 * @param jsContent - JavaScript文件的完整内容。
 * @param dictionaryKey - 要提取的字典的键名（例如 'PMAttributeMap._skillAttributeData'）。
 * @returns 解析后的字典数据。
 */
export function extractDictionary(jsContent: string, dictionaryKey: string): unknown {
  // 构建一个正则表达式来匹配 "key = { ... }" 或 "key = [ ... ]"
  // 这个正则表达式会寻找变量赋值，并捕获括号内的所有内容。
  const keyPath = dictionaryKey.replace(/\./g, '\\.');
  const regex = new RegExp(`${keyPath}\\s*=\\s*(\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\});`);
  
  const match = jsContent.match(regex);

  if (match && match[1]) {
    const dataString = match[1];
    return safeParse(dataString);
  }

  throw new Error(`在JS内容中未找到键为 "${dictionaryKey}" 的字典。`);
}

/**
 * 从给定的URL获取JS文件，并从中提取和解析一个字典。
 * @param url - JavaScript文件的URL。
 * @param dictionaryKey - 要提取的字典的键名。
 * @returns 解析后的字典数据。
 */
export async function fetchAndParseDictionary(url: string, dictionaryKey: string): Promise<unknown> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
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