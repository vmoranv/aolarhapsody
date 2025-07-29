import { fetchAndParseJSON } from './game-data-parser';
import { ChatFrame } from '../types/chatframe';

const chatFrameCache: Record<string, ChatFrame> = {};

/**
 * 初始化聊天框数据模块
 */
export async function initChatFrameModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/chatframedata.json';
    console.log('开始获取聊天框数据JSON文件...');
    const response = await fetchAndParseJSON(url) as {
      data: Record<string, (string | number)[]>;
    };

    if (!response || !response.data) {
      console.error('聊天框数据为空或格式不正确');
      return false;
    }

    // 解析聊天框
    Object.values(response.data).forEach(item => {
      if (Array.isArray(item) && item.length >= 8) {
        const frame: ChatFrame = {
          id: Number(item[0]),
          name: String(item[1]),
          type: Number(item[2]),
          price: Number(item[3]),
          rmb: Number(item[4]),
          level: Number(item[5]),
          desc: String(item[6]),
          startDate: String(item[7]),
        };
        chatFrameCache[frame.id] = frame;
      }
    });

    console.log(`成功解析并缓存了 ${Object.keys(chatFrameCache).length} 个聊天框`);
    return true;
  } catch (error) {
    console.error('解析聊天框数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有已缓存的聊天框。
 * @returns {ChatFrame[]} 聊天框对象数组。
 */
export function getAllChatFrames(): ChatFrame[] {
  return Object.values(chatFrameCache);
}

/**
 * 根据ID获取单个聊天框。
 * @param {string} id - 聊天框的ID。
 * @returns {ChatFrame | null} 对应的聊天框对象，如果未找到则返回null。
 */
export function getChatFrameById(id: string): ChatFrame | null {
  return chatFrameCache[id] || null;
}