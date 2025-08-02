import {
  TaskAreaConfig,
  TaskBitTitle,
  TaskDefine,
  TaskNpcName,
  TaskStarter,
  TaskSubTitle,
} from '../types/task';
import { URL_CONFIG } from '../types/url-config';
import { fetchAndParseJSON } from './game-data-parser';

/**
 * 原始剧情数据负载接口
 */
interface RawTaskPayload {
  defines: Record<string, [string, string, string | undefined]>;
  starters: Record<string, [string, string, string, string, string, string, string, string]>;
  bitTitle: Record<string, TaskBitTitle>;
  subTitle: Record<string, TaskSubTitle>;
  areaConfig: Record<string, TaskAreaConfig>;
  npcNames: TaskNpcName;
  orderInArea: Record<string, Record<string, string[]>>;
}

const cachedTasks: {
  defines: Record<string, TaskDefine>;
  starters: Record<string, TaskStarter>;
  bitTitle: Record<string, TaskBitTitle>;
  subTitle: Record<string, TaskSubTitle>;
  areaConfig: Record<string, TaskAreaConfig>;
  orderInArea: Record<string, Record<string, string[]>>;
  npcNames: TaskNpcName;
} = {
  defines: {},
  starters: {},
  bitTitle: {},
  subTitle: {},
  areaConfig: {},
  orderInArea: {},
  npcNames: {},
};

/**
 * 初始化剧情数据模块
 * @returns {Promise<boolean>} 如果初始化成功，则返回true，否则返回false
 */
export async function initTaskModule(): Promise<boolean> {
  try {
    const rawData = (await fetchAndParseJSON(URL_CONFIG.task)) as RawTaskPayload;

    if (!rawData || typeof rawData !== 'object') {
      console.error('剧情数据为空或格式不正确');
      return false;
    }

    // 解析 剧情组定义
    if (rawData.defines) {
      Object.values(rawData.defines).forEach((item) => {
        const define: TaskDefine = {
          taskId: parseInt(item[0], 10),
          type: parseInt(item[1], 10),
          extData: item[2] ? item[2].split(',').map(Number) : [],
        };
        cachedTasks.defines[define.taskId] = define;
      });
    }

    // 解析 开始剧情
    if (rawData.starters) {
      Object.values(rawData.starters).forEach((item) => {
        const starter: TaskStarter = {
          taskId: parseInt(item[0], 10),
          type: parseInt(item[1], 10),
          extData: item[2],
          preString: item[3],
          isOnline: parseInt(item[4], 10),
          taskName: item[5],
          line: parseInt(item[6], 10),
          area: parseInt(item[7], 10),
        };
        cachedTasks.starters[starter.taskId] = starter;
      });
    }

    // 解析 剧情标题
    if (rawData.bitTitle) {
      Object.values(rawData.bitTitle).forEach((item) => {
        cachedTasks.bitTitle[item.id] = item;
      });
    }

    // 解析 子标题
    if (rawData.subTitle) {
      Object.values(rawData.subTitle).forEach((item) => {
        cachedTasks.subTitle[item.subTitleId] = item;
      });
    }

    // 解析 区域配置
    if (rawData.areaConfig) {
      Object.values(rawData.areaConfig).forEach((item) => {
        cachedTasks.areaConfig[item.id] = item;
      });
    }

    cachedTasks.npcNames = rawData.npcNames || {};
    cachedTasks.orderInArea = rawData.orderInArea || {};

    return true;
  } catch (error) {
    console.error('解析剧情数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有缓存的剧情数据
 * @returns {object} 包含所有剧情数据的对象
 */
export function getTaskData() {
  return cachedTasks;
}

/**
 * 根据ID获取剧情定义
 * @param {number} id - 剧情ID
 * @returns {TaskDefine | undefined} 找到的剧情定义，否则为undefined
 */
export function getTaskDefineById(id: number) {
  return cachedTasks.defines[id];
}

/**
 * 根据ID获取开始剧情
 * @param {number} id - 剧情ID
 * @returns {TaskStarter | undefined} 找到的开始剧情，否则为undefined
 */
export function getTaskStarterById(id: number) {
  return cachedTasks.starters[id];
}

/**
 * 获取所有剧情定义
 * @returns {TaskDefine[]} 剧情定义对象数组
 */
export function getAllDefines() {
  return Object.values(cachedTasks.defines);
}

/**
 * 获取所有开始剧情
 * @returns {TaskStarter[]} 开始剧情对象数组
 */
export function getAllStarters() {
  return Object.values(cachedTasks.starters);
}

/**
 * 获取所有剧情大标题
 * @returns {TaskBitTitle[]} 剧情大标题对象数组
 */
export function getAllBitTitles() {
  return Object.values(cachedTasks.bitTitle);
}

/**
 * 获取所有剧情子标题
 * @returns {TaskSubTitle[]} 剧情子标题对象数组
 */
export function getAllSubTitles() {
  return Object.values(cachedTasks.subTitle);
}

/**
 * 获取所有剧情区域配置
 * @returns {TaskAreaConfig[]} 剧情区域配置对象数组
 */
export function getAllAreaConfigs() {
  return Object.values(cachedTasks.areaConfig);
}

/**
 * 获取区域内的剧情顺序
 * @returns {object} 区域剧情顺序对象
 */
export function getOrderInArea() {
  return cachedTasks.orderInArea;
}

/**
 * 获取所有NPC名称
 * @returns {object} NPC名称对象
 */
export function getAllNpcNames() {
  return cachedTasks.npcNames;
}
