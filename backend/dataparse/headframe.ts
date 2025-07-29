import { fetchAndParseJSON } from './game-data-parser';
import { HeadFrame } from '../types/headframe';

const headFrameCache: Record<string, HeadFrame> = {};

/**
 * 初始化头像框数据模块
 */
export async function initHeadFrameModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/headframedata.json';
    console.log('开始获取头像框数据JSON文件...');
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number)[]>;
    };

    if (!response || !response.data) {
      console.error('头像框数据为空或格式不正确');
      return false;
    }

    // 解析头像框
    Object.values(response.data).forEach(item => {
      if (Array.isArray(item) && item.length >= 8) {
        const headFrame: HeadFrame = {
          id: Number(item[0]),
          name: String(item[1]),
          type: Number(item[2]),
          price: Number(item[3]),
          rmb: Number(item[4]),
          level: Number(item[5]),
          desc: String(item[6]),
          startDate: String(item[7]),
        };
        headFrameCache[headFrame.id] = headFrame;
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(headFrameCache).length} 个头像框`);
    return true;
  } catch (error) {
    console.error('解析头像框数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存头像框的简要列表。
 * @returns {{ id: number; name: string }[]} 包含头像框ID和名称的对象数组。
 */
export function getAllHeadFrames(): { id: number; name: string }[] {
  return Object.values(headFrameCache).map(frame => ({
    id: frame.id,
    name: frame.name,
  }));
}

/**
 * 根据ID获取单个头像框的完整信息。
 * @param {string} id - 头像框的ID。
 * @returns {HeadFrame | null} 对应的头像框对象，如果未找到则返回null。
 */
export function getHeadFrameById(id: string): HeadFrame | null {
  return headFrameCache[id] || null;
}