import { EraData } from '../types/petdictionary';
import { Pet, ProcessedAttribute, Skill, SkillAttribute, Weather } from '../types/pmdatalist';
import { URL_CONFIG } from '../types/urlconfig';
import { extractDictionary, fetchAndParseJSON, fetchJavaScriptFile } from './gamedataparser';

// =================================
// 核心逻辑
// =================================

/**
 * 存储完整亚比数据的缓存
 * @type {Pet[]}
 */
let fullPetDataCache: Pet[] = [];
let expMapCache: Record<string, number[]> = {};
let weatherMapCache: Record<string, Weather> = {};
const skillMapCache: Record<string, Skill> = {};
let attributeRelationsCache: Record<string, string[]> = {};
const skillAttributesCache: ProcessedAttribute[] = [];
let petTypeDataCache: {
  legend: EraData;
  degenerator: EraData;
  xinghui: EraData;
  gq: EraData;
} | null = null;

/**
 * 解析并缓存所有亚比数据
 * @param rawData - 包含亚比、经验、场地、技能和属性相克关系的原始数据对象
 * @returns {boolean} 如果解析和缓存成功则返回true，否则返回false
 */
export function parseAndCacheFullPetData(rawData: {
  pmDataMap: unknown;
  pmExpMap: Record<string, (string | number)[]>;
  pmWeatherMap: Record<string, (string | number)[]>;
  pmSkillMap: Record<string, (string | number)[]>;
  pmSkillMap1: Record<string, (string | number)[]>;
  pmAttDefTableMap: Record<string, string[]>;
}): boolean {
  if (!rawData) {
    console.error('亚比数据为空，无法解析完整数据');
    return false;
  }

  try {
    // 解析亚比数据
    const processFullData = (dataMap: unknown): Pet[] => {
      return Object.values(dataMap as Record<string, (string | number)[]>)
        .filter((pet) => Array.isArray(pet) && pet.length >= 1 && pet[0])
        .map(
          (pet: (string | number)[]): Pet => ({
            id: pet[0],
            rawData: pet,
          })
        )
        .filter((pet) => {
          const petId = Number(pet.id.toString().replace('_0', ''));
          return !isNaN(petId) && petId >= 0 && petId <= 9999;
        });
    };
    fullPetDataCache = processFullData(rawData.pmDataMap);

    // 解析经验表
    if (rawData.pmExpMap && typeof rawData.pmExpMap === 'object') {
      expMapCache = Object.entries(rawData.pmExpMap).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = value.map((v) => Number(v));
          }
          return acc;
        },
        {} as Record<string, number[]>
      );
    } else {
      console.warn('未找到或格式不正确的经验表 (pmExpMap)');
    }

    // 解析场地效果
    if (rawData.pmWeatherMap && typeof rawData.pmWeatherMap === 'object') {
      weatherMapCache = Object.entries(rawData.pmWeatherMap).reduce(
        (acc, [key, value]) => {
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
        },
        {} as Record<string, Weather>
      );
    }

    // 解析技能数据
    const combinedSkillMap = { ...(rawData.pmSkillMap || {}), ...(rawData.pmSkillMap1 || {}) };
    if (Object.keys(combinedSkillMap).length > 0) {
      Object.assign(
        skillMapCache,
        Object.entries(combinedSkillMap).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value) && value.length >= 29) {
              const getPars = (index: number) => String(value[index] || '');
              const getSkillType = () => {
                const str = getPars(29);
                return str.length > 0 ? parseInt(str) : 0; // 默认值为0
              };
              const soulArr = getPars(30).split('#');

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
                aoyiType: getPars(19) === '' ? -1 : parseInt(getPars(19)),
                isCompletePMSkill: getPars(20) !== '',
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
                isDegeneratorSpiritPassive: getPars(34) === '1',
                simpleSkillDec: getPars(38),
                beAttackMvType: getPars(39) === '' ? Number(getPars(12)) : parseInt(getPars(39)),
                cd: parseInt(getPars(42)) || 0,
              };
            }
            return acc;
          },
          {} as Record<string, Skill>
        )
      );
    } else {
      console.warn('未找到技能数据 (pmSkillMap, pmSkillMap1)');
    }

    // 解析克制关系
    if (rawData.pmAttDefTableMap) {
      attributeRelationsCache = rawData.pmAttDefTableMap;
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
 * @returns {{ id: string | number; name: string; attribute1: string | number; attribute2: string | number }[]} 一个包含亚比ID、名称和系别的对象数组
 */
export function getPetList(): {
  id: string | number;
  name: string;
  attribute1: string | number;
  attribute2: string | number;
}[] {
  return fullPetDataCache.map((pet) => ({
    id: pet.id,
    name: String(pet.rawData[1] || '未知'),
    attribute1: pet.rawData[16] || '0',
    attribute2: pet.rawData[17] || '0',
  }));
}

/**
 * 根据ID获取亚比的完整数据
 * @param id - 亚比的ID
 * @returns {Pet | null} 如果找到则返回亚比对象，否则返回null
 */
export function getPetFullDataById(id: string | number): Pet | null {
  const processedId = id.toString().replace('_0', '');
  return (
    fullPetDataCache.find((pet) => pet.id.toString().replace('_0', '') === processedId) || null
  );
}

/**
 * 根据关键字搜索亚比
 * @param keyword - 搜索关键字
 * @returns {{ id: string | number; name: string }[]} 匹配搜索条件的亚比列表
 */
export function searchPets(keyword: string): { id: string | number; name: string }[] {
  const searchStr = keyword.toLowerCase();
  return fullPetDataCache
    .filter((pet) => {
      const name = String(pet.rawData[1] || '').toLowerCase();
      return pet.id.toString().includes(searchStr) || name.includes(searchStr);
    })
    .map((pet) => ({
      id: pet.id,
      name: String(pet.rawData[1] || '未知'),
    }));
}

/**
 * 计算从当前等级和经验升到目标等级所需的经验值
 * @param petId - 亚比的ID
 * @param currentLevel - 当前等级
 * @param currentExp - 当前等级下的经验值
 * @param targetLevel - 目标等级
 * @returns {{ success: boolean; requiredExp?: number; message?: string }} 一个包含操作是否成功、所需经验值和可选消息的对象
 */
export function calculateExp(
  petId: string,
  currentLevel: number,
  currentExp: number,
  targetLevel: number
): { success: boolean; requiredExp?: number; message?: string } {
  const pet = getPetFullDataById(petId);

  // 检查pet是否存在
  if (!pet) {
    return { success: false, message: `未找到ID为 ${petId} 的亚比` };
  }

  // 经验成长类型在index:21
  const expType = String(pet.rawData[21]);
  const expTable = expMapCache[expType] || expMapCache['0'];

  // 检查经验表是否存在
  if (!expTable || expTable.length === 0) {
    return { success: false, message: `未找到经验类型 ${expType} 的经验表` };
  }

  // 验证等级范围
  if (
    currentLevel < 1 ||
    currentLevel > expTable.length ||
    targetLevel < 1 ||
    targetLevel > expTable.length
  ) {
    return { success: false, message: `等级必须在1到${expTable.length}之间` };
  }

  // 验证当前经验值
  if (currentExp < 0) {
    return { success: false, message: '当前经验值不能为负数' };
  }

  // 验证目标等级
  if (targetLevel <= currentLevel) {
    return { success: false, message: '目标等级必须大于当前等级' };
  }

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
 * 获取所有场地效果的简化列表
 * @returns {{ id: string; name: string }[]} 一个包含场地效果ID和名称的对象数组
 */
export function getAllWeathers(): { id: string; name: string }[] {
  return Object.values(weatherMapCache).map((weather) => ({
    id: weather.id,
    name: weather.name,
  }));
}

/**
 * 根据ID获取场地效果
 * @param id - 场地效果的ID
 * @returns {Weather | null} 如果找到则返回场地效果对象，否则返回null
 */
export function getWeatherById(id: string): Weather | null {
  return weatherMapCache[id] || null;
}

/**
 * 根据ID获取技能
 * @param id - 技能的ID
 * @returns {Skill | null} 如果找到则返回技能对象，否则返回null
 */
export function getSkillById(id: string): Skill | null {
  return skillMapCache[id] || null;
}

/**
 * 获取属性克制关系
 * @returns {Record<string, string[]>} 一个表示属性克制关系的对象
 */
export function getAttributeRelations(): Record<string, string[]> {
  return attributeRelationsCache;
}

/**
 * 获取亚比的时代/体系数据
 * @returns {Promise<{ legend: EraData; degenerator: EraData; xinghui: EraData; gq: EraData }>}
 */
export async function getPetTypeData(): Promise<{
  legend: EraData;
  degenerator: EraData;
  xinghui: EraData;
  gq: EraData;
}> {
  if (!petTypeDataCache) {
    await fetchAndCacheGameMainData();
  }
  return petTypeDataCache!;
}

// =================================================================
// 技能属性及时代/体系解析逻辑
// =================================================================

const EXCLUDED_ATTRIBUTE_IDS = [3, 6, 17];

/**
 * 处理所有技能属性，过滤掉不需要的属性并进行格式化
 * @param attributeMap - 从游戏数据中解析出的原始技能属性数组
 * @returns {ProcessedAttribute[]} 处理过的技能属性对象数组
 */
function processAllAttributes(attributeMap: SkillAttribute[]): ProcessedAttribute[] {
  return attributeMap
    .filter((attr) => !EXCLUDED_ATTRIBUTE_IDS.includes(attr[0]))
    .map((attr) => ({
      id: attr[0],
      name: attr[1],
    }));
}

/**
 * 从远程获取、解析并缓存所有技能属性和时代/体系数据
 * 如果缓存中已存在数据，则直接返回
 * @returns {Promise<void>}
 * @throws {Error} 当获取或解析数据失败时抛出错误
 */
export async function fetchAndCacheGameMainData(): Promise<void> {
  if (skillAttributesCache.length > 0 && petTypeDataCache) {
    return;
  }

  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);

    // 解析技能属性
    if (skillAttributesCache.length === 0) {
      const rawSkillData = extractDictionary(
        jsContent,
        'PMAttributeMap._skillAttributeData'
      ) as SkillAttribute[];
      // 验证...
      const processedData = processAllAttributes(rawSkillData);
      skillAttributesCache.push(...processedData);
    }

    // 解析时代/体系数据
    if (!petTypeDataCache) {
      const buildEraData = (eraKey: string, nameArr: string[]): EraData => {
        const regex = new RegExp(`${eraKey}\\.([A-Z_\\d]+)\\s*=\\s*(-?\\d+);`, 'g');
        const idToSystemNameMap: Record<string, string> = {};
        const systemNameToIdMap: Record<string, number> = {};
        let match;
        while ((match = regex.exec(jsContent)) !== null) {
          const systemName = match[1];
          const id = match[2];
          const numId = parseInt(id, 10);
          if (numId >= 0) {
            idToSystemNameMap[id] = systemName;
            systemNameToIdMap[systemName] = numId;
          }
        }
        const arrForMapping = nameArr[0] === '' ? nameArr.slice(1) : nameArr;
        const idToDisplayNameMap = Object.fromEntries(
          arrForMapping.map((name, i) => [(i + 1).toString(), name])
        );
        return { idToSystemNameMap, idToDisplayNameMap, systemNameToIdMap };
      };

      const degeneratorNames = extractDictionary(
        jsContent,
        'DegeneratorPetType.PetTypeNameArr'
      ) as string[];
      const xinghuiNames = extractDictionary(
        jsContent,
        'XinghuiPetType.PetTypeNameArr'
      ) as string[];
      const gqNames = extractDictionary(jsContent, 'GQPetType.SystemNameArr') as string[];

      const legend: EraData = {
        idToSystemNameMap: {},
        idToDisplayNameMap: {},
        systemNameToIdMap: {},
      };
      const legendRegex = /LegendPetType\.([A-Z_]+)\s*=\s*(\d+);/g;
      const legendNameMap: Record<string, string> = {
        KILL: '必杀型传奇（KILL）',
        FIELD: '领域型传奇（FIELD）',
        TOTEM: '图腾型传奇（TOTEM）',
      };
      let match;
      while ((match = legendRegex.exec(jsContent)) !== null) {
        const systemName = match[1];
        const id = match[2];
        const numId = parseInt(id, 10);
        legend.idToSystemNameMap[id] = systemName;
        legend.systemNameToIdMap[systemName] = numId;
        if (legendNameMap[systemName]) {
          legend.idToDisplayNameMap[id] = legendNameMap[systemName];
        }
      }

      petTypeDataCache = {
        legend,
        degenerator: buildEraData('DegeneratorPetType', degeneratorNames),
        xinghui: buildEraData('XinghuiPetType', xinghuiNames),
        gq: buildEraData('GQPetType', gqNames),
      };
    }
  } catch (error) {
    console.error('获取或处理gameMain.js数据时出错:', error);
    throw error;
  }
}

/**
 * 获取所有技能属性数据
 * @returns {Promise<ProcessedAttribute[]>}
 */
export async function fetchAndGetAllSkillAttributes(): Promise<ProcessedAttribute[]> {
  if (skillAttributesCache.length === 0) {
    await fetchAndCacheGameMainData();
  }
  return skillAttributesCache;
}

/**
 * 初始化亚比数据处理模块
 * @returns {Promise<boolean>} 如果初始化成功则返回true，否则返回false
 */
export async function initPetDataModule(): Promise<boolean> {
  try {
    const data = (await fetchAndParseJSON(URL_CONFIG.pmDataList)) as {
      pmDataMap: unknown;
      pmExpMap: Record<string, (string | number)[]>;
      pmWeatherMap: Record<string, (string | number)[]>;
      pmSkillMap: Record<string, (string | number)[]>;
      pmSkillMap1: Record<string, (string | number)[]>;
      pmAttDefTableMap: Record<string, string[]>;
    };
    return parseAndCacheFullPetData(data);
  } catch (error) {
    console.error('初始化亚比数据处理模块失败:', error);
    return false;
  }
}
