import { URL_CONFIG } from '../types/url';
import { fetchData, fetchDataItem } from './api';
import { ProcessedAttribute } from './attribute-helper';

/**
 * 定义亚比图片的URL集合
 */
export interface PetImages {
  bigImage: string;
  smallImage: string;
  eggImage: string;
}

/**
 * 亚比简要信息
 */
export interface PetListItem {
  id: string | number;
  name: string;
  attribute1: string | number;
  attribute2: string | number;
}

/**
 * 获取亚比图片URL
 * @param id 亚比ID
 * @param type 图片类型 ('small', 'big', 'egg')
 * @returns 图片的URL
 */
export function getPetImageUrl(
  id: string | number,
  type: 'small' | 'big' | 'egg' = 'small'
): string {
  if (!id) {
    console.error('getPetImageUrl: ID不能为空');
    return '';
  }

  try {
    // 处理特殊ID格式
    const processedId = id.toString().replace('_0', '');
    const numId = Number(processedId);

    // 检查ID是否在有效范围内
    if (numId < 1 || numId > 9999) {
      console.warn(`ID ${processedId} 超出有效范围 (1-9999)`);
    }

    switch (type) {
      case 'big':
        // 大图URL
        if (numId >= 4399) {
          // 4399及以上使用新格式
          return `${URL_CONFIG.petIconPrefix}/newlarge/type1/peticon${numId}/peticon${numId}_1.png`;
        } else if (numId > 3923) {
          // 3924-4398使用e目录
          return `${URL_CONFIG.petIconPrefix}/big/e/peticon${numId}.png`;
        } else {
          // 1-3923使用普通目录
          return `${URL_CONFIG.petIconPrefix}/big/peticon${numId}.png`;
        }

      case 'small':
        // 小图URL
        if (numId >= 4399) {
          // 4399及以上使用新格式
          return `${URL_CONFIG.petIconPrefix}/newlarge/type1/peticon${numId}/peticon${numId}_0.png`;
        } else {
          // 1-4398使用普通格式
          return `${URL_CONFIG.petIconPrefix}/small/peticon${numId}.png`;
        }

      case 'egg':
        // 蛋图URL
        return `${URL_CONFIG.petEggPrefix}/egg${numId}.png`;

      default:
        return `${URL_CONFIG.petIconPrefix}/small/peticon${numId}.png`;
    }
  } catch (error) {
    console.error('getPetImageUrl出错:', error);
    return '';
  }
}

/**
 * 获取所有类型的亚比图片URL
 * @param id 亚比ID
 * @returns 包含所有类型图片URL的对象
 */
export function getPetImageUrls(id: string | number): PetImages {
  return {
    bigImage: getPetImageUrl(id, 'big'),
    smallImage: getPetImageUrl(id, 'small'),
    eggImage: getPetImageUrl(id, 'egg'),
  };
}

/**
 * 获取亚比简要列表
 * @returns 返回所有亚比的简要列表
 */
export async function fetchPetList(): Promise<PetListItem[]> {
  return fetchData<PetListItem>('pets');
}

/**
 * 根据ID获取单个亚比的原始数据
 * @param id 亚比ID
 * @returns 返回单个亚比的原始数据数组
 */
export async function fetchPetRawDataById(id: string | number): Promise<(string | number)[]> {
  return fetchDataItem<(string | number)[]>(`pet`, id.toString());
}

/**
 * 表示一个技能
 */
export interface Skill {
  /** 技能的ID */
  id: number;
  /** 技能的英文名称 */
  enName: string;
  /** 技能的中文名称 */
  cnName: string;
  /** 技能的新中文名称 */
  newCnName: string;
  /** 技能的旧效果描述 */
  oldEffectDesc: string;
  /** 技能的新效果描述 */
  newEffectDesc: string;
  /** 技能的客户端描述 */
  clientDesc: string;
  /** 技能的威力 */
  power: number;
  /** 技能的命中率 */
  hitRate: number;
  /** 技能的总PP值 */
  allPP: number;
  /** 技能的优先级 */
  PRI: number;
  /** 技能的属性类型 */
  attributeType: number;
  /** 技能的攻击类型 */
  attackType: number;
  /** 技能的命中目标 */
  hitTaget: number;
  /** 技能的暴击率 */
  critRate: number;
  /** 技能的伤害类型 */
  damageType: number;
  /** 技能的执行类型 */
  execType: string;
  /** 技能的处理程序 */
  handler: string;
  /** 技能的参数 */
  param: string;
  /** 技能的奥义类型 */
  aoyiType: number;
  /** 技能是否为完整的PM技能 */
  isCompletePMSkill: boolean;
  /** 第一个技能动画 */
  skillMovie1: string;
  /** 第二个技能动画 */
  skillMovie2: string;
  /** 技能在单打中的威力 */
  singlePower: string;
  /** 技能在双打中的威力 */
  doublePower: string;
  /** 技能的类型 */
  skillType: number;
  /** 技能消耗的魂数 */
  costSoulNum: number;
  /** 技能可以消耗的最大魂数 */
  maxCostSoulNum: number;
  /** 配置技能序列 */
  configSkillSerials: string;
  /** 传奇领域效果的变化 */
  legendFiledEffectChange: number;
  /** 传奇领域效果的描述 */
  legendFiledEffectDesc: string;
  /** 技能是否为退化星灵被动 */
  isDegeneratorSpiritPassive: boolean;
  /** 简单的技能描述 */
  simpleSkillDec: string;
  /** 受击动画的类型 */
  beAttackMvType: number;
  /** 技能的冷却时间 */
  cd: number;
}

/**
 * 根据ID获取技能数据
 * @param id 技能ID
 * @returns 返回技能的详细数据
 */
export async function fetchSkillById(id: number): Promise<Skill> {
  return fetchDataItem<Skill>('skill', id.toString());
}

/**
 * 获取所有技能属性
 * @returns 返回所有技能属性的数组
 */
export async function fetchSkillAttributes(): Promise<ProcessedAttribute[]> {
  return fetchData<ProcessedAttribute>('skill-attributes');
}

/**
 * 将字符串按'#'分割成数组
 * @param str 字符串或数字
 * @returns 字符串数组
 */
export const splitToArray = (str: string | number | undefined): string[] => {
  if (!str) {
    return [];
  }
  return str
    .toString()
    .split('#')
    .filter((item) => item);
};

/**
 * 创建属性名称映射
 * @param skillAttributes 技能属性数组
 * @returns 属性ID到名称的映射
 */
export const createAttributeNameMap = (
  skillAttributes: ProcessedAttribute[]
): Map<number, string> => {
  const map = new Map<number, string>();
  skillAttributes.forEach((attr) => {
    map.set(attr.id, attr.name);
  });
  return map;
};

/**
 * 生成技能项
 * @param selectedPetRawData 亚比原始数据
 * @param isNewSkillSet 是否为新技能组
 * @returns 技能项数组
 */
export const generateSkillItems = (
  selectedPetRawData: (string | number)[] | undefined,
  isNewSkillSet: boolean
) => {
  if (!selectedPetRawData) {
    return [];
  }
  const skillDataSource = isNewSkillSet ? selectedPetRawData[88] : selectedPetRawData[29];
  if (!skillDataSource) {
    return [
      {
        key: '1',
        label: '技能列表',
        children: null, // 使用 null 代替 Empty 组件
      },
    ];
  }
  const skillArray = splitToArray(skillDataSource);
  return [
    {
      key: '1',
      label: `技能列表 (${skillArray.length}个)`,
      children: skillArray, // 直接返回技能数组
    },
  ];
};

/**
 * 过滤亚比列表
 * @param pets 亚比列表
 * @param searchKeyword 搜索关键字
 * @param selectedAttribute 选中的属性
 * @returns 过滤后的亚比列表
 */
export const filterPets = (
  pets: PetListItem[],
  searchKeyword: string,
  selectedAttribute: string
): PetListItem[] => {
  if (!searchKeyword && selectedAttribute === 'all') {
    return [];
  }

  let filteredPets = pets;
  if (searchKeyword) {
    const lowerCaseKeyword = searchKeyword.toLowerCase();
    filteredPets = filteredPets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(lowerCaseKeyword) ||
        pet.id.toString().includes(lowerCaseKeyword)
    );
  }
  if (selectedAttribute !== 'all') {
    filteredPets = filteredPets.filter(
      (pet) =>
        pet.attribute1.toString() === selectedAttribute ||
        pet.attribute2.toString() === selectedAttribute
    );
  }

  return filteredPets.slice(0, 5);
};
