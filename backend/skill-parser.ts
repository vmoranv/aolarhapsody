import axios from 'axios';

// =================================
// 类型定义
// =================================
export type SkillAttribute = [number, string];
export type ProcessedAttribute = { id: number; name: string; isSuper: boolean };

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  timestamp: string;
}

// =================================
// 核心处理逻辑
// =================================
const EXCLUDED_ATTRIBUTE_IDS = [3, 6, 17];

function isSuperAttribute(id: number): boolean {
  return id > 22;
}

function getAllAttributes(attributeMap: SkillAttribute[]): ProcessedAttribute[] {
  return attributeMap
    .filter(attr => !EXCLUDED_ATTRIBUTE_IDS.includes(attr[0]))
    .map(attr => ({
      id: attr[0],
      name: attr[1],
      isSuper: isSuperAttribute(attr[0]),
    }));
}

// =================================
// 数据获取与安全解析
// =================================

/**
 * 安全解析 JavaScript 数组字符串
 * 避免使用 eval() 和 Function 构造函数
 */
function safeParseJavaScriptArray(arrayStr: string): SkillAttribute[] {
  try {
    // 首先尝试 JSON.parse
    return JSON.parse(arrayStr) as SkillAttribute[];
  } catch {
    // JSON.parse 失败时，手动解析数组
    return parseArrayString(arrayStr);
  }
}

/**
 * 手动解析数组字符串
 * 专门用于解析 [[number, string], ...] 格式的数组
 */
function parseArrayString(str: string): SkillAttribute[] {
  // 移除外层的方括号
  const content = str.trim().replace(/^\[/, '').replace(/\]$/, '');
  if (!content.trim()) {
    return [];
  }

  const result: SkillAttribute[] = [];
  let current = '';
  let bracketCount = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (!inString && (char === '"' || char === "'")) {
      inString = true;
      stringChar = char;
      current += char;
    } else if (inString && char === stringChar && content[i - 1] !== '\\') {
      inString = false;
      stringChar = '';
      current += char;
    } else if (!inString && char === '[') {
      bracketCount++;
      current += char;
    } else if (!inString && char === ']') {
      bracketCount--;
      current += char;
      
      if (bracketCount === 0) {
        // 解析单个数组元素
        const element = parseArrayElement(current.trim());
        if (element) {
          result.push(element);
        }
        current = '';
      }
    } else if (!inString && char === ',' && bracketCount === 0) {
      // 跳过顶级逗号
      continue;
    } else {
      current += char;
    }
  }

  return result;
}

/**
 * 解析单个数组元素 [number, string]
 */
function parseArrayElement(elementStr: string): SkillAttribute | null {
  try {
    // 移除方括号
    const content = elementStr.trim().replace(/^\[/, '').replace(/\]$/, '');
    const parts = content.split(',').map(part => part.trim());
    
    if (parts.length !== 2) {
      return null;
    }

    // 解析数字
    const id = parseInt(parts[0], 10);
    if (isNaN(id)) {
      return null;
    }

    // 解析字符串，移除引号
    let name = parts[1];
    if ((name.startsWith('"') && name.endsWith('"')) || 
        (name.startsWith("'") && name.endsWith("'"))) {
      name = name.slice(1, -1);
    }

    return [id, name];
  } catch {
    return null;
  }
}

/**
 * 解析PMAttributeMap._skillAttributeData的函数
 */
function extractSkillAttributeData(jsContent: string): SkillAttribute[] {
  try {
    const patterns = [
      /PMAttributeMap\._skillAttributeData\s*=\s*(\[[\s\S]*?\]);/,
      /PMAttributeMap\._skillAttributeData\s*=\s*(\[[\s\S]*?\])\s*[;}]/,
      /_skillAttributeData\s*=\s*(\[[\s\S]*?\]);/,
    ];

    let match: RegExpMatchArray | null = null;
    for (const pattern of patterns) {
      match = jsContent.match(pattern);
      if (match) {
        break;
      }
    }

    if (!match) {
      throw new Error('未找到PMAttributeMap._skillAttributeData数据');
    }

    const arrayStr = match[1]
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\s+/g, ' ')
      .trim();

    const skillAttributeData = safeParseJavaScriptArray(arrayStr);

    if (!Array.isArray(skillAttributeData)) {
      throw new Error('解析结果不是数组');
    }

    for (const item of skillAttributeData) {
      if (
        !Array.isArray(item) ||
        item.length !== 2 ||
        typeof item[0] !== 'number' ||
        typeof item[1] !== 'string'
      ) {
        throw new Error('数组元素格式不正确');
      }
    }
    
    return skillAttributeData;
  } catch (error) {
    throw new Error(`解析失败: ${(error as Error).message}`);
  }
}

/**
 * 获取并处理所有技能属性数据
 */
export async function fetchAndProcessAllAttributes(): Promise<ApiResponse<ProcessedAttribute[]>> {
  try {
    console.log('开始获取JavaScript文件...');
    const url = 'http://aola.100bt.com/h5/js/gamemain.js';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }

    const jsContent = response.data;
    const rawData = extractSkillAttributeData(jsContent);
    const processedData = getAllAttributes(rawData);

    return {
      success: true,
      data: processedData,
      count: processedData.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('处理错误:', errorMessage);
    return {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 获取并解析克制关系表
 */
export async function fetchAttributeRelations(): Promise<ApiResponse<Record<string, string[]>>> {
  try {
    console.log('开始获取克制关系JSON文件...');
    const url = 'https://aola.100bt.com/h5/data/pmdatalist.json';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }

    const data = response.data;
    if (!data || !data.pmAttDefTableMap) {
      throw new Error('未找到pmAttDefTableMap数据');
    }

    return {
      success: true,
      data: data.pmAttDefTableMap,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('处理克制关系错误:', errorMessage);
    return {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };
  }
}