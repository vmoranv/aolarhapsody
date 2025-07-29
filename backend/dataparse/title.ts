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
    console.log('开始获取称号数据JSON文件...');
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

    console.log(`成功解析并缓存了 ${data.length} 个称号`);
    return true;
  } catch (error) {
    console.error('解析称号数据时出错:', error);
    return false;
  }
}

export function getTitleData() {
  return cachedTitles;
}

export function getTitleById(id: number) {
  return cachedTitles?.data.find(t => t.titleId === id);
}

export function getTitleConfig() {
  return cachedTitles?.titleConfig;
}