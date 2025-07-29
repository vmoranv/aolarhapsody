import { fetchAndParseData } from './game-data-parser';
import { Tote, ToteData, ToteEntryData, ToteValueData } from '../types/tote';

interface RawTotePayload {
  data: Record<string, [string, string, string, string, string, string, string, string]>;
  entry: Record<string, [string, string, string]>;
  value: Record<string, [string, string, string, string, string]>;
}

let cachedTotes: Tote | null = null;

/**
 * 初始化魂器数据模块
 */
export async function initToteModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/totedata.json';
    console.log('开始获取魂器数据JSON文件...');
    const rawData = await fetchAndParseData<RawTotePayload>(url);

    if (!rawData || typeof rawData !== 'object') {
      console.error('魂器数据为空或格式不正确');
      return false;
    }

    type RawToteData = [string, string, string, string, string, string, string, string];
    const dataArray = rawData.data && typeof rawData.data === 'object' ? Object.values(rawData.data as Record<string, RawToteData>) : [];
    const data: ToteData[] = dataArray.map((item: RawToteData) => ({
      id: parseInt(item[0], 10),
      name: item[1],
      color: parseInt(item[2], 10),
      type: parseInt(item[3], 10),
      baseValue: item[4],
      effectValue: item[5],
      advantageValue: item[6],
      tujianDes: item[7],
    }));

    type RawToteEntry = [string, string, string];
    const entryArray = rawData.entry && typeof rawData.entry === 'object' ? Object.values(rawData.entry as Record<string, RawToteEntry>) : [];
    const entry: ToteEntryData[] = entryArray.map((item: RawToteEntry) => ({
      id: parseInt(item[0], 10),
      name: item[1],
      des: item[2],
    }));

    type RawToteValue = [string, string, string, string, string];
    const valueArray = rawData.value && typeof rawData.value === 'object' ? Object.values(rawData.value as Record<string, RawToteValue>) : [];
    const value: ToteValueData[] = valueArray.map((item: RawToteValue) => ({
      id: parseInt(item[0], 10),
      name: item[1],
      des: item[2],
      dataStr: item[3],
      advantageRadio: parseFloat(item[4]),
    }));

    cachedTotes = {
      data,
      entry,
      value,
    };

    console.log(`成功解析并缓存了 ${data.length} 个魂器数据`);
    return true;
  } catch (error) {
    console.error('解析魂器数据时出错:', error);
    return false;
  }
}

export function getToteData() {
  return cachedTotes;
}

export function getToteDataById(id: number) {
  return cachedTotes?.data.find(d => d.id === id);
}

export function getToteEntryById(id: number) {
  return cachedTotes?.entry.find(e => e.id === id);
}

export function getToteValueById(id: number) {
  return cachedTotes?.value.find(v => v.id === id);
}