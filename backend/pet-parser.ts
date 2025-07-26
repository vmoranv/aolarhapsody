import axios from 'axios';

// =================================
// 类型定义
// =================================

export interface Pet {
  id: string | number;
  rawData: (string | number)[];
}

// =================================
// 核心逻辑
// =================================

/**
 * 存储完整亚比数据的缓存
 */
let fullPetDataCache: Pet[] = [];
let expMapCache: Record<string, number[]> = {};

/**
 * 解析并缓存所有亚比数据
 */
export function parseAndCacheFullPetData(rawData: { pmDataMap: unknown, pmExpMap: Record<string, (string | number)[]> }): boolean {
  if (!rawData) {
    console.error('亚比数据为空，无法解析完整数据');
    return false;
  }

  try {
    // 解析亚比数据
    const processFullData = (dataMap: unknown): Pet[] => {
      if (!dataMap || typeof dataMap !== 'object') return [];
      return Object.values(dataMap as Record<string, (string | number)[]>)
        .filter(pet => Array.isArray(pet) && pet.length >= 1 && pet[0])
        .map((pet: (string | number)[]): Pet => ({
          id: pet[0],
          rawData: pet,
        }))
        .filter(pet => {
          const petId = Number(pet.id.toString().replace('_0', ''));
          return !isNaN(petId) && petId >= 0 && petId <= 9999;
        });
    };
    fullPetDataCache = processFullData(rawData.pmDataMap);
    console.log(`成功解析并缓存了 ${fullPetDataCache.length} 个亚比的完整数据（ID范围：0-9999）`);

    // 解析经验表
    if (rawData.pmExpMap && typeof rawData.pmExpMap === 'object') {
      expMapCache = Object.entries(rawData.pmExpMap).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value.map(v => Number(v));
        }
        return acc;
      }, {} as Record<string, number[]>);
      console.log(`成功解析并缓存了 ${Object.keys(expMapCache).length} 个经验成长类型`);
    } else {
      console.warn('未找到或格式不正确的经验表 (pmExpMap)');
    }

    return true;
  } catch (error) {
    console.error('解析亚比数据时出错:', error);
    return false;
  }
}

/**
 * 获取简化的亚比列表（用于图鉴）
 */
export function getPetList(): { id: string | number; name: string }[] {
    return fullPetDataCache.map(pet => ({
        id: pet.id,
        name: String(pet.rawData[1] || '未知'),
    }));
}

/**
 * 根据ID获取亚比完整数据
 */
export function getPetFullDataById(id: string | number): Pet | null {
  if (!id) return null;
  
  const processedId = id.toString().replace('_0', '');
  return fullPetDataCache.find(pet => 
    pet.id.toString().replace('_0', '') === processedId
  ) || null;
}

/**
 * 搜索亚比
 */
export function searchPets(keyword: string): { id: string | number; name: string }[] {
  if (!keyword) return getPetList();
  
  const searchStr = keyword.toLowerCase();
  return fullPetDataCache
    .filter(pet => {
      const name = String(pet.rawData[1] || '').toLowerCase();
      return pet.id.toString().includes(searchStr) || name.includes(searchStr);
    })
    .map(pet => ({
      id: pet.id,
      name: String(pet.rawData[1] || '未知'),
    }));
}

/**
 * 计算所需经验
 */
export function calculateExp(
  petId: string,
  currentLevel: number,
  currentExp: number,
  targetLevel: number
): { success: boolean; requiredExp?: number; message?: string } {
  const pet = getPetFullDataById(petId);
  // 经验成长类型在index:21
  const expType = String(pet!.rawData[21]);
  const expTable = expMapCache[expType] || expMapCache['0'];
  
  // 计算当前等级的总经验值
  const currentLevelTotalExp = expTable[currentLevel - 1];
  // 计算当前总经验值
  const totalCurrentExp = currentLevelTotalExp + currentExp;
  // 目标等级所需经验值
  const targetExp = expTable[targetLevel - 1];
  // 计算还需要的经验值
  const requiredExp = Math.max(0, targetExp - totalCurrentExp);
  
  return { success: true, requiredExp };
}

/**
 * 初始化亚比数据处理模块
 */
export async function initPetDataModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/pmdatalist.json';
    console.log('开始获取亚比数据JSON文件...');
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    const success = parseAndCacheFullPetData(response.data);
    return success;
  } catch (error) {
    console.error('初始化亚比数据处理模块失败:', error);
    return false;
  }
}

