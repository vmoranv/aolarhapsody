import { cloneDeep, get, set } from 'lodash';

export interface Placeholder {
  path: string;
  range: {
    start: number;
    end: number;
  };
}

/**
 * 递归地查找JSON对象中的所有键路径
 * @param obj JSON对象
 * @param path 当前路径
 * @returns 返回所有键路径的数组
 */
const findAllJsonKeys = (obj: any, path: string = ''): string[] => {
  let keys: string[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newPath = path ? `${path}.${key}` : key;
      keys.push(newPath);
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys = keys.concat(findAllJsonKeys(obj[key], newPath));
      }
    }
  }
  return keys;
};

/**
 * 解析模板并识别所有JSON键作为占位符
 * @param template 多行文本模板
 * @returns 返回一个包含占位符信息的对象数组
 */
export const parseTemplateForPlaceholders = (template: string): Placeholder[] => {
  const lines = template.split('\n').filter((line) => line.trim() !== '');
  if (lines.length === 0) {
    return [];
  }

  try {
    const getJson = (line: string, extractParam: boolean = false) => {
      if (extractParam) {
        const paramKey = '"param":';
        const paramIndex = line.indexOf(paramKey);
        if (paramIndex === -1) {
          throw new Error('No "param" key found');
        }
        const startIndex = line.indexOf('{', paramIndex + paramKey.length);
        if (startIndex === -1) {
          throw new Error('No JSON object found after "param" key');
        }

        let balance = 1;
        let endIndex = startIndex + 1;
        while (endIndex < line.length && balance > 0) {
          if (line[endIndex] === '{') {
            balance++;
          } else if (line[endIndex] === '}') {
            balance--;
          }
          endIndex++;
        }

        if (balance !== 0) {
          throw new Error('Invalid JSON structure for "param" object');
        }

        return JSON.parse(line.substring(startIndex, endIndex));
      }

      // Fallback for the whole object if needed, e.g. for initial value retrieval
      const startIndex = line.indexOf('{');
      const endIndex = line.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        throw new Error('No valid JSON object found');
      }
      return JSON.parse(line.substring(startIndex, endIndex + 1));
    };

    const allKeys = new Set<string>();
    lines.forEach((line) => {
      const json = getJson(line, true); // Extract from "param"
      const keys = findAllJsonKeys(json);
      keys.forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys).map((path) => {
      const firstJson = getJson(lines[0], true); // Extract from "param"
      const initialValue = get(firstJson, path, 0);
      return {
        path,
        range: { start: typeof initialValue === 'number' ? initialValue : 0, end: 10 },
      };
    });
  } catch {
    return [];
  }
};

/**
 * 根据模板和范围生成组合
 * @param template 原始模板字符串（可能有多行）
 * @param placeholders 占位符数组
 * @returns 生成的所有组合结果字符串
 */
export const generateCombinationsFromPlaceholders = (
  template: string,
  placeholders: Placeholder[]
): string => {
  if (placeholders.length === 0) {
    return template;
  }

  const rangeLists = placeholders.map((p) =>
    Array.from({ length: p.range.end - p.range.start + 1 }, (_, i) => p.range.start + i)
  );

  const product = (...a: number[][]): number[][] =>
    a.reduce((acc, val) => acc.flatMap((x) => val.map((y) => [...x, y])), [[]] as number[][]);

  const combinations = product(...rangeLists);

  const originalLines = template.split('\n').filter((line) => line.trim() !== '');

  const results = combinations.map((combo) => {
    const firstLine = originalLines[0] || '';
    try {
      // We need to reconstruct the original full JSON, modify the param part, then stringify
      const startIndex = firstLine.indexOf('{');
      if (startIndex === -1) {
        throw new Error('No JSON object found in template line');
      }

      let balance = 1;
      let endIndex = startIndex + 1;
      while (endIndex < firstLine.length && balance > 0) {
        if (firstLine[endIndex] === '{') {
          balance++;
        } else if (firstLine[endIndex] === '}') {
          balance--;
        }
        endIndex++;
      }

      if (balance !== 0) {
        throw new Error('Invalid JSON structure in template line');
      }

      const jsonString = firstLine.substring(startIndex, endIndex);
      const fullJsonTemplate = JSON.parse(jsonString);
      let newFullJson = cloneDeep(fullJsonTemplate);

      // Get the param part, modify it, then set it back
      let paramJson = get(newFullJson, 'param', {});

      placeholders.forEach((ph, i) => {
        paramJson = set(cloneDeep(paramJson), ph.path, combo[i]);
      });

      newFullJson = set(newFullJson, 'param', paramJson);

      const prefix = firstLine.substring(0, firstLine.indexOf('{'));
      return prefix + JSON.stringify(newFullJson);
    } catch (e) {
      return `Error processing template line: ${(e as Error).message}`;
    }
  });

  return results.join('\n');
};
