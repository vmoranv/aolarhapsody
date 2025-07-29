import { fetchAndParseDictionary, fetchAndParseJSON } from './game-data-parser';
import { Pet, Weather, Skill, SkillAttribute, ProcessedAttribute } from '../types/pmdatalist';

// =================================
// 核心逻辑
// =================================

/**
 * 存储完整亚比数据的缓存
 */
let fullPetDataCache: Pet[] = [];
let expMapCache: Record<string, number[]> = {};
let weatherMapCache: Record<string, Weather> = {};
const skillMapCache: Record<string, Skill> = {};
let attributeRelationsCache: Record<string, string[]> = {};
const skillAttributesCache: ProcessedAttribute[] = [];

/**
 * 解析并缓存所有亚比数据
 */
export function parseAndCacheFullPetData(rawData: {
  pmDataMap: unknown,
  pmExpMap: Record<string, (string | number)[]>,
  pmWeatherMap: Record<string, (string | number)[]>,
  pmSkillMap: Record<string, (string | number)[]>,
  pmSkillMap1: Record<string, (string | number)[]>,
  pmAttDefTableMap: Record<string, string[]>
}): boolean {
  if (!rawData) {
    console.error('亚比数据为空，无法解析完整数据');
    return false;
  }

  try {
    // 解析亚比数据
    const processFullData = (dataMap: unknown): Pet[] => {
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

    // 解析场地效果
    if (rawData.pmWeatherMap && typeof rawData.pmWeatherMap === 'object') {
      weatherMapCache = Object.entries(rawData.pmWeatherMap).reduce((acc, [key, value]) => {
        if (Array.isArray(value) && value.length >= 5) {
          const weatherData: Weather = {
            id: String(value[0]),
            name: String(value[1]),
            type: Number(value[2]),
            serverDescription: String(value[3]),
            description: String(value[4]),
          };

          // 处理传奇魂相关逻辑
          if (value.length >= 8 && value[6] && value[7]) {
            const serials = String(value[7]).split(',');
            weatherData.legendSoul = {
              baseDescription: String(value[6]),
              serials: serials,
              maxLevel: serials.length - 1,
            };
          }
          acc[key] = weatherData;
        }
        return acc;
      }, {} as Record<string, Weather>);
      console.log(`成功解析并缓存了 ${Object.keys(weatherMapCache).length} 个场地效果`);
    }

    // 解析技能数据
    const combinedSkillMap = { ...(rawData.pmSkillMap || {}), ...(rawData.pmSkillMap1 || {}) };
    if (Object.keys(combinedSkillMap).length > 0) {
      Object.assign(skillMapCache, Object.entries(combinedSkillMap).reduce((acc, [key, value]) => {
        if (Array.isArray(value) && value.length >= 30) {
          const getPars = (index: number) => String(value[index] || '');
          const getSkillType = () => {
            const str = getPars(29);
            return str.length > 0 ? parseInt(str) : 0; // 默认值为0
          };
          const soulArr = getPars(30).split("#");

          acc[key] = {
            id: Number(getPars(0)),
            enName: getPars(1),
            cnName: getPars(2),
            newCnName: getPars(3),
            oldEffectDesc: getPars(4).replace(/<br>/g, '\n'),
            newEffectDesc: getPars(5),
            clientDesc: getPars(6).replace(/<br>/g, '\n'),
            power: Number(getPars(7)),
            hitRate: Number(getPars(8)),
            allPP: Number(getPars(9)),
            PRI: Number(getPars(10)),
            attributeType: Number(getPars(11)),
            attackType: Number(getPars(12)),
            hitTaget: Number(getPars(13)),
            critRate: Number(getPars(14)),
            damageType: Number(getPars(15)),
            execType: getPars(16),
            handler: getPars(17),
            param: getPars(18),
            aoyiType: getPars(19) === "" ? -1 : parseInt(getPars(19)),
            isCompletePMSkill: getPars(20) !== "",
            skillMovie1: getPars(22),
            skillMovie2: getPars(23),
            singlePower: getPars(27),
            doublePower: getPars(28),
            skillType: getSkillType(),
            costSoulNum: parseInt(soulArr[0]) || 0,
            maxCostSoulNum: parseInt(soulArr[soulArr.length - 1]) || 0,
            configSkillSerials: getPars(31),
            legendFiledEffectChange: parseInt(getPars(32)) || 0,
            legendFiledEffectDesc: getPars(33),
            isDegeneratorSpiritPassive: getPars(34) === "1",
            simpleSkillDec: getPars(38),
            beAttackMvType: getPars(39) === "" ? Number(getPars(12)) : parseInt(getPars(39)),
            cd: parseInt(getPars(42)) || 0,
          };
        }
        return acc;
      }, {} as Record<string, Skill>));
      console.log(`成功解析并缓存了 ${Object.keys(skillMapCache).length} 个技能`);
    } else {
      console.warn('未找到技能数据 (pmSkillMap, pmSkillMap1)');
    }

    // 解析克制关系
    if (rawData.pmAttDefTableMap) {
      attributeRelationsCache = rawData.pmAttDefTableMap;
      console.log(`成功解析并缓存了克制关系表`);
    } else {
      console.warn('未找到克制关系表 (pmAttDefTableMap)');
    }

    return true;
  } catch (error) {
    console.error('解析亚比数据时出错:', error);
    return false;
  }
}

/**
 * 获取简化的亚比列表
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
  const processedId = id.toString().replace('_0', '');
  return fullPetDataCache.find(pet => 
    pet.id.toString().replace('_0', '') === processedId
  ) || null;
}

/**
 * 搜索亚比
 */
export function searchPets(keyword: string): { id: string | number; name: string }[] {
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
 * 获取所有场地效果
 */
export function getAllWeathers(): { id: string; name: string }[] {
  return Object.values(weatherMapCache).map(weather => ({
    id: weather.id,
    name: weather.name,
  }));
}

/**
 * 根据ID获取场地效果
 */
export function getWeatherById(id: string): Weather | null {
  return weatherMapCache[id] || null;
}

/**
 * 根据ID获取技能
 */
export function getSkillById(id: string): Skill | null {
  return skillMapCache[id] || null;
}

/**
 * 获取克制关系
 */
export function getAttributeRelations(): Record<string, string[]> {
  return attributeRelationsCache;
}

// =================================================================
// 技能属性解析逻辑
// =================================================================

const EXCLUDED_ATTRIBUTE_IDS = [3, 6, 17];

function isSuperAttribute(id: number): boolean {
  return id > 22;
}

function processAllAttributes(attributeMap: SkillAttribute[]): ProcessedAttribute[] {
  return attributeMap
    .filter(attr => !EXCLUDED_ATTRIBUTE_IDS.includes(attr[0]))
    .map(attr => ({
      id: attr[0],
      name: attr[1],
      isSuper: isSuperAttribute(attr[0]),
    }));
}

export async function fetchAndGetAllSkillAttributes(): Promise<ProcessedAttribute[]> {
  if (skillAttributesCache.length > 0) {
    console.log('技能属性数据已缓存,直接返回');
    return skillAttributesCache;
  }

  try {
    console.log('首次获取, 开始获取技能属性数据...');
    const url = 'http://aola.100bt.com/h5/js/gamemain.js';
    const rawData = await fetchAndParseDictionary(url, 'PMAttributeMap._skillAttributeData') as SkillAttribute[];

    // 验证解析后的数据结构
    if (!Array.isArray(rawData)) {
      throw new Error('解析结果不是数组');
    }
    for (const item of rawData) {
      if (!Array.isArray(item) || item.length !== 2 || typeof item[0] !== 'number' || typeof item[1] !== 'string') {
        throw new Error('数组元素格式不正确');
      }
    }

    const processedData = processAllAttributes(rawData);
    
    skillAttributesCache.push(...processedData); // 缓存结果
    console.log(`成功解析并缓存了 ${processedData.length} 个技能属性`);
    
    return processedData;
  } catch (error) {
    console.error('获取或处理技能属性数据时出错:', error);
    throw error; // 向上抛出错误，让调用者处理
  }
}

/**
 * 初始化亚比数据处理模块
 */
export async function initPetDataModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/pmdatalist.json';
    console.log('开始获取亚比数据JSON文件...');
    const data = await fetchAndParseJSON(url) as {
      pmDataMap: unknown,
      pmExpMap: Record<string, (string | number)[]>,
      pmWeatherMap: Record<string, (string | number)[]>,
      pmSkillMap: Record<string, (string | number)[]>,
      pmSkillMap1: Record<string, (string | number)[]>,
      pmAttDefTableMap: Record<string, string[]>
    };
    return parseAndCacheFullPetData(data);
  } catch (error) {
    console.error('初始化亚比数据处理模块失败:', error);
    return false;
  }
}

