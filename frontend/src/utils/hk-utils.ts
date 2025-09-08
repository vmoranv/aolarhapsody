import type { HKBuff } from '../types/hk';
import { fetchDataItem } from './api';

/**
 * 解析魂卡的wordBar字段
 * @param wordBar - 格式为 "1_2#3_3#1_3#3_3#13_1" 的字符串
 * @returns 解析后的buff ID和等级数组
 */
export function parseWordBar(wordBar: string): Array<{ buffId: number; level: number }> {
  if (!wordBar) return [];

  return wordBar.split('#').map((part) => {
    const [buffId, level] = part.split('_').map(Number);
    return { buffId, level };
  });
}

/**
 * 根据buff ID获取buff详细信息
 * @param buffId - Buff ID
 * @returns Promise<HKBuff>
 */
export async function fetchHKBuffDetail(buffId: number): Promise<HKBuff> {
  return await fetchDataItem<HKBuff>('hkbuffs', buffId.toString());
}
