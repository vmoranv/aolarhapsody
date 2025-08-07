import type { PetDictionaryDataItem } from '../../../backend/types/petdictionary';
import { fetchData, fetchDataItem } from './api';

/**
 * 亚比图鉴数据类型
 */
export type PetDictionaryData = PetDictionaryDataItem;

/**
 * 定义计算结果中单个属性的接口
 */
interface StatInfo {
  value: number;
  percent: number;
  display: string;
}

/**
 * 定义处理后的亚比图鉴属性信息
 */
export interface PetDictionaryStatInfo {
  height: StatInfo;
  weight: StatInfo;
}

/**
 * 获取亚比图鉴列表
 * @returns 返回所有亚比图鉴项的数组
 */
export async function fetchPetDictionaryList(): Promise<PetDictionaryData[]> {
  return fetchData<PetDictionaryData>('petdictionary');
}

/**
 * 根据ID获取单个亚比图鉴数据
 * @param id 亚比ID
 * @returns 返回单个亚比的详细图鉴数据
 */
export async function fetchPetDictionaryById(id: number): Promise<PetDictionaryData> {
  return fetchDataItem<PetDictionaryData>('petdictionary', id.toString());
}

/**
 * 计算亚比图鉴中的属性信息，用于UI展示
 * @param pet 亚比图鉴数据
 * @returns 计算后的属性信息，包含数值、百分比和显示文本
 */
export function calculateDictionaryStatInfo(pet: PetDictionaryData): PetDictionaryStatInfo | null {
  if (!pet) return null;

  const height = parseFloat(pet.petHeight) || 0;
  const weight = parseFloat(pet.petWeight) || 0;

  // 基准值，可根据所有亚比的最大值进行调整
  const maxHeight = 300; // 假设最大身高300cm
  const maxWeight = 200; // 假设最大体重200kg

  return {
    height: {
      value: height,
      percent: Math.min((height / maxHeight) * 100, 100),
      display: height ? `${height} cm` : '未知',
    },
    weight: {
      value: weight,
      percent: Math.min((weight / maxWeight) * 100, 100),
      display: weight ? `${weight} kg` : '未知',
    },
  };
}

/**
 * 解析亚比的属性字符串
 * @param attributeStr 属性字符串，如 "4,5,10"
 * @returns 解析后的属性ID数组
 */
export function parsePetAttribute(attributeStr: string): number[] {
  if (!attributeStr) return [];
  return attributeStr
    .split(',')
    .filter((id) => id)
    .map((id) => parseInt(id, 10));
}

/**
 * 从获取方式中解析进化来源
 * @param getWay 获取方式字符串
 * @returns 返回包含进化来源ID和名称的对象，如果未找到则返回null
 */
export function parseEvolutionSource(getWay: string): { id: string; name: string } | null {
  if (!getWay) return null;

  const evolutionMatch = getWay.match(/由##(\d+)_(.*?)##进化得来/);
  if (evolutionMatch) {
    return {
      id: evolutionMatch[1],
      name: evolutionMatch[2],
    };
  }

  return null;
}
