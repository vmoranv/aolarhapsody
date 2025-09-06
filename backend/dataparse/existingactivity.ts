import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { ExistingActivity } from '../types/existingactivity';
import { URL_CONFIG } from '../types/urlconfig';
import { getFromCache, saveToCache } from './file-cache';

const lowerCase = (name: string) => name.toLowerCase();

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
          const activity: ExistingActivity = {
            name: item.$.tips,
            packet: `#activ='${item.action.res.$.file}','${item.action.res.$.cls}'`,
          };
          activities.push(activity);
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
