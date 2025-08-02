import { monitorConfig } from '../types/monitor-config';
import { fetchAndParseJSON } from './game-data-parser';

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
    const data = await fetchAndParseJSON(url);
    if (!data) {
      throw new Error(`Failed to fetch or parse data from ${url}`);
    }

    const allSubclasses = Object.keys(data);
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
export function initializeMonitors() {
  for (const key in monitorConfig) {
    const source = monitorConfig[key];
    // 在后台启动检查，不阻塞应用启动
    checkUrl(source.url, source.knownSubclasses);
  }
}

/**
 * 获取缓存的子类检查结果。
 * @param {string} url - 结果对应的URL。
 * @returns {CheckResult | undefined} 缓存的结果，如果不存在则为undefined。
 */
export function getCachedCheckResult(url: string): CheckResult | undefined {
  return checkResultsCache[url];
}
