import fs from 'fs-extra';
import path from 'path';

const CACHE_DIR = path.join(__dirname, '..', '.cache');
fs.ensureDirSync(CACHE_DIR);

function getCacheKey(url: string): string {
  return Buffer.from(url).toString('base64');
}

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

export async function saveToCache<T>(url: string, data: T): Promise<void> {
  const cacheKey = getCacheKey(url);
  const cachePath = path.join(CACHE_DIR, cacheKey);

  try {
    await fs.writeJson(cachePath, data);
  } catch (error) {
    console.error(`将数据写入缓存时出错: ${url}`, error);
  }
}
