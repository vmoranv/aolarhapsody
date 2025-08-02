import { ToteData, ToteEntryData, ToteValueData } from '../types/tote';
import { URL_CONFIG } from '../types/url-config';
import { fetchAndParseJSON } from './game-data-parser';

/**
 * 原始魂器数据负载接口
 */
interface RawTotePayload {
  data: Record<string, [string, string, string, string, string, string, string, string]>;
  entry: Record<string, [string, string, string]>;
  value: Record<string, [string, string, string, string, string]>;
}

const cachedTotes: {
  data: Record<string, ToteData>;
  entry: Record<string, ToteEntryData>;
  value: Record<string, ToteValueData>;
} = {
  data: {},
  entry: {},
  value: {},
};

/**
 * 初始化魂器数据模块
 * @returns {Promise<boolean>} 如果初始化成功，则返回true，否则返回false
 */
export async function initToteModule(): Promise<boolean> {
  try {
    const rawData = (await fetchAndParseJSON(URL_CONFIG.tote)) as RawTotePayload;

    if (!rawData || typeof rawData !== 'object') {
      console.error('魂器数据为空或格式不正确');
      return false;
    }

    if (rawData.data) {
      Object.values(rawData.data).forEach((item) => {
        const tote: ToteData = {
          id: parseInt(item[0], 10),
          name: item[1],
          color: parseInt(item[2], 10),
          type: parseInt(item[3], 10),
          baseValue: item[4],
          effectValue: item[5],
          advantageValue: item[6],
          tujianDes: item[7],
        };
        cachedTotes.data[tote.id] = tote;
      });
    }

    if (rawData.entry) {
      Object.values(rawData.entry).forEach((item) => {
        const entry: ToteEntryData = {
          id: parseInt(item[0], 10),
          name: item[1],
          des: item[2],
        };
        cachedTotes.entry[entry.id] = entry;
      });
    }

    if (rawData.value) {
      Object.values(rawData.value).forEach((item) => {
        const value: ToteValueData = {
          id: parseInt(item[0], 10),
          name: item[1],
          des: item[2],
          dataStr: item[3],
          advantageRadio: parseFloat(item[4]),
        };
        cachedTotes.value[value.id] = value;
      });
    }

    return true;
  } catch (error) {
    console.error('解析魂器数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有魂器数据
 * @returns {ToteData[]} 魂器数据对象数组
 */
export function getAllToteData(): ToteData[] {
  return Object.values(cachedTotes.data);
}

/**
 * 获取所有魂器词条数据
 * @returns {ToteEntryData[]} 魂器词条数据对象数组
 */
export function getAllToteEntries(): ToteEntryData[] {
  return Object.values(cachedTotes.entry);
}

/**
 * 获取所有魂器值数据
 * @returns {ToteValueData[]} 魂器值数据对象数组
 */
export function getAllToteValues(): ToteValueData[] {
  return Object.values(cachedTotes.value);
}

/**
 * 根据ID获取魂器数据
 * @param {number} id - 魂器ID
 * @returns {ToteData | undefined} 找到的魂器数据，否则为undefined
 */
export function getToteDataById(id: number): ToteData | undefined {
  return cachedTotes.data[id];
}

/**
 * 根据ID获取魂器词条数据
 * @param {number} id - 词条ID
 * @returns {ToteEntryData | undefined} 找到的魂器词条数据，否则为undefined
 */
export function getToteEntryById(id: number): ToteEntryData | undefined {
  return cachedTotes.entry[id];
}

/**
 * 根据ID获取魂器值数据
 * @param {number} id - 值ID
 * @returns {ToteValueData | undefined} 找到的魂器值数据，否则为undefined
 */
export function getToteValueById(id: number): ToteValueData | undefined {
  return cachedTotes.value[id];
}
