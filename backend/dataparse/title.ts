import { fetchAndParseData } from './game-data-parser';
import { TitleData, Title, TitleConfig } from '../types/title';

interface RawTitlePayload {
  data: Record<string, [string, string, string, string, boolean, string, string, string]>;
  titleConfig: TitleConfig;
}

let cachedTitles: TitleData | null = null;

/**
 * 初始化称号数据模块
 */
export async function initTitleModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/title.json';
    const rawData = await fetchAndParseData<RawTitlePayload>(url);

    if (!rawData || typeof rawData !== 'object') {
      console.error('称号数据为空或格式不正确');
      return false;
    }

    // The `data` property is an object, not an array. We need to convert it to an array first.
    type RawTitle = [string, string, string, string, boolean, string, string, string];
    const dataArray = rawData.data && typeof rawData.data === 'object' ? Object.values(rawData.data as Record<string, RawTitle>) : [];

    const data: Title[] = dataArray.map((item: RawTitle) => ({
      titleId: parseInt(item[0], 10),
      titleName: item[1],
      titleLev: parseInt(item[2], 10),
      titleTips: item[3],
      titleIsVip: item[4],
      titleTime: item[5],
      titleDisplayType: parseInt(item[6], 10),
      startTime: item[7],
    }));

    const titleConfig: TitleConfig = typeof rawData.titleConfig === 'object' && rawData.titleConfig !== null ? rawData.titleConfig : {};

    cachedTitles = {
      titleConfig,
      data,
    };

    return true;
  } catch (error) {
    console.error('解析称号数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的称号数据
 * @returns {TitleData | null} 包含称号配置和称号列表的对象，如果未初始化则返回null
 */
export function getTitleData() {
  return cachedTitles;
}

/**
 * 根据ID获取特定的称号
 * @param {number} id - 称号的ID
 * @returns {Title | undefined} 对应的称号对象，如果未找到则返回undefined
 */
export function getTitleById(id: number) {
  return cachedTitles?.data.find(t => t.titleId === id);
}

/**
 * 获取称号的配置信息
 * @returns {TitleConfig | undefined} 称号的配置对象，如果未初始化则返回undefined
 */
export function getTitleConfig() {
  return cachedTitles?.titleConfig;
}