import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { ExistingActivity } from '../types/existingactivity';
import { URL_CONFIG } from '../types/urlconfig';
import { getFromCache, saveToCache } from './file-cache';

/**
 * 将字符串转换为小写。
 * @param name - 要转换的字符串。
 * @returns 小写形式的字符串。
 */
const lowerCase = (name: string) => name.toLowerCase();

/**
 * 获取现存活动列表。
 * 该函数首先尝试从缓存中加载数据。如果缓存中不存在，则从远程URL获取XML数据，
 * 解析该数据以提取活动信息，然后将结果存入缓存并返回。
 * @returns 一个包含现存活动对象的数组的Promise。
 * @throws 如果获取或解析数据失败，则抛出错误。
 */
export async function getExistingActivities(): Promise<ExistingActivity[]> {
  const cachedData = await getFromCache<ExistingActivity[]>(URL_CONFIG.sceneItem);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(URL_CONFIG.sceneItem, {
      responseType: 'arraybuffer', // 处理不同的编码
    });

    // 根据XML声明，使用utf-8解码
    let xmlData = new TextDecoder('utf-8').decode(response.data);

    // 如果存在BOM，则删除
    if (xmlData.startsWith('\uFEFF')) {
      xmlData = xmlData.substring(1);
    }

    // 预处理XML以处理特殊字符，避免双重转义
    const cleanedXmlData = xmlData.replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&');

    const result = await parseStringPromise(cleanedXmlData, {
      explicitArray: false,
      strict: false,
      attrkey: '$',
      charkey: '_',
      tagNameProcessors: [lowerCase],
      attrNameProcessors: [lowerCase],
    });

    const scenes = result.config.scene || [];
    const activities: ExistingActivity[] = [];
    const uniqueActivities = new Set<string>(); // 用于跟踪唯一的活动

    for (const scene of scenes) {
      const items = scene.item;
      if (!items) {
        continue;
      }

      const itemsArray = Array.isArray(items) ? items : [items];

      for (const item of itemsArray) {
        if (
          item.$ &&
          item.$.tips &&
          item.action &&
          item.action.res &&
          item.action.res.$ &&
          item.action.res.$.file &&
          item.action.res.$.cls
        ) {
          const name = item.$.tips;
          const packet = `#activ='${item.action.res.$.file}','${item.action.res.$.cls}'`;
          const uniqueKey = `${name}|${packet}`;

          if (!uniqueActivities.has(uniqueKey)) {
            uniqueActivities.add(uniqueKey);
            const activity: ExistingActivity = {
              name,
              packet,
            };
            activities.push(activity);
          }
        }
      }
    }

    await saveToCache(URL_CONFIG.sceneItem, activities);
    return activities;
  } catch (error) {
    console.error('Error fetching or parsing existing activities:', error);
    throw new Error('Failed to retrieve existing activities.');
  }
}
