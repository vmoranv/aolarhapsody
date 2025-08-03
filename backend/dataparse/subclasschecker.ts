import { monitorConfig } from '../types/monitorconfig';
import { fetchAndParseJSON } from './gamedataparser';

export interface CheckResult {
  allSubclasses: string[];
  newSubclasses: string[];
  subclassCount: number;
  hasNew: boolean;
}

const checkResultsCache: Record<string, CheckResult> = {};

/**
 * 检查指定URL的JSON数据是否包含新的子类。
 * @param url - 要获取和检查的URL。
 * @param knownSubclasses - 已知子类的数组。
 * @returns {Promise<CheckResult>} 包含检查结果的对象。
 */
async function checkUrl(url: string, knownSubclasses: string[]): Promise<CheckResult> {
  try {
    const shouldTruncate = url === monitorConfig.petTalk.url || url === monitorConfig.petIcon.url;
    const data = await fetchAndParseJSON(url, shouldTruncate);
    if (!data) {
      throw new Error(`Failed to fetch or parse data from ${url}`);
    }

    // 如果 knownSubclasses 为空，我们假定这是一个动态键的字典，不进行检查
    if (knownSubclasses.length === 0) {
      const allKeys = Object.keys(data);
      const result: CheckResult = {
        allSubclasses: allKeys,
        newSubclasses: [],
        subclassCount: allKeys.length,
        hasNew: false,
      };
      checkResultsCache[url] = result;
      return result;
    }

    let allSubclasses: string[];

    // 检查数据是否为 { data: [...] } 的结构
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
      // 从每个子数组中提取名称（假设名称在索引1的位置）
      allSubclasses = (data as any).data.map((item: any) => item[1]?.toString()).filter(Boolean);
    } else {
      // 否则，使用对象的键作为子类
      allSubclasses = Object.keys(data);
    }

    const newSubclasses = allSubclasses.filter((key) => !knownSubclasses.includes(key));
    const result: CheckResult = {
      allSubclasses,
      newSubclasses,
      subclassCount: allSubclasses.length,
      hasNew: newSubclasses.length > 0,
    };

    checkResultsCache[url] = result;
    return result;
  } catch (error) {
    console.error(`Error checking subclasses for ${url}:`, error);
    const errorResult: CheckResult = {
      allSubclasses: [],
      newSubclasses: [],
      subclassCount: 0,
      hasNew: false,
    };
    checkResultsCache[url] = errorResult;
    return errorResult;
  }
}

/**
 * 初始化所有在配置中定义的监控任务。
 */
export async function initializeMonitors(): Promise<void> {
  const promises = [];
  for (const key in monitorConfig) {
    const source = monitorConfig[key];
    promises.push(checkUrl(source.url, source.knownSubclasses));
  }
  await Promise.all(promises);
}

/**
 * 获取缓存的子类检查结果。
 * @param {string} url - 结果对应的URL。
 * @returns {CheckResult | undefined} 缓存的结果，如果不存在则为undefined。
 */
export function getCachedCheckResult(url: string): CheckResult | undefined {
  return checkResultsCache[url];
}
