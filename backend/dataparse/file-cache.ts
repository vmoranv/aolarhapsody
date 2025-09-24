import fs from 'fs-extra';
import path from 'path';

const CACHE_DIR = path.join(__dirname, '..', '.cache');
fs.ensureDirSync(CACHE_DIR);

/**
 * @description 根据 URL 生成缓存键
 * @param {string} url - 数据的 URL
 * @returns {string} 缓存键
 */
function getCacheKey(url: string): string {
  return Buffer.from(url).toString('base64');
}

/**
 * @description 从缓存中获取数据
 * @template T
 * @param {string} url - 数据的 URL
 * @returns {Promise<T | null>} 缓存的数据或 null
 */
export async function getFromCache<T>(url: string): Promise<T | null> {
  const cacheKey = getCacheKey(url);
  const cachePath = path.join(CACHE_DIR, cacheKey);

  if (await fs.pathExists(cachePath)) {
    try {
      const data = await fs.readJson(cachePath);
      return data as T;
    } catch (error) {
      console.error(`从缓存读取数据时出错: ${url}`, error);
      return null;
    }
  }
  return null;
}

/**
 * @description 将数据保存到缓存
 * @template T
 * @param {string} url - 数据的 URL
 * @param {T} data - 要缓存的数据
 * @returns {Promise<void>}
 */
export async function saveToCache<T>(url: string, data: T): Promise<void> {
  const cacheKey = getCacheKey(url);
  const cachePath = path.join(CACHE_DIR, cacheKey);

  try {
    await fs.writeJson(cachePath, data);
  } catch (error) {
    console.error(`将数据写入缓存时出错: ${url}`, error);
  }
}
