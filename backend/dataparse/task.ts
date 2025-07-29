import { fetchAndParseData } from './game-data-parser';
import { TaskData, TaskDefine, TaskStarter, TaskBitTitle, TaskSubTitle, TaskAreaConfig, TaskNpcName } from '../types/task';

/**
 * 原始任务数据负载接口。
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

let cachedTasks: TaskData | null = null;

/**
 * 初始化任务数据模块。
 * @returns {Promise<boolean>} 如果初始化成功，则返回true，否则返回false。
 */
export async function initTaskModule(): Promise<boolean> {
  try {
    const url = 'https://aola.100bt.com/h5/data/taskdata.json';
    console.log('开始获取任务数据JSON文件...');
    const rawData = await fetchAndParseData<RawTaskPayload>(url);

    if (!rawData || typeof rawData !== 'object') {
      console.error('任务数据为空或格式不正确');
      return false;
    }

    type RawTaskDefine = [string, string, string | undefined];
    const definesArray = rawData.defines && typeof rawData.defines === 'object' ? Object.values(rawData.defines as Record<string, RawTaskDefine>) : [];
    const defines: TaskDefine[] = definesArray.map((item: RawTaskDefine) => ({
      taskId: parseInt(item[0], 10),
      type: parseInt(item[1], 10),
      extData: item[2] ? item[2].split(',').map(Number) : [],
    }));

    type RawTaskStarter = [string, string, string, string, string, string, string, string];
    const startersArray = rawData.starters && typeof rawData.starters === 'object' ? Object.values(rawData.starters as Record<string, RawTaskStarter>) : [];
    const starters: TaskStarter[] = startersArray.map((item: RawTaskStarter) => ({
      taskId: parseInt(item[0], 10),
      type: parseInt(item[1], 10),
      extData: item[2],
      preString: item[3],
      isOnline: parseInt(item[4], 10),
      taskName: item[5],
      line: parseInt(item[6], 10),
      area: parseInt(item[7], 10),
    }));

    const bitTitleArray = rawData.bitTitle && typeof rawData.bitTitle === 'object' ? Object.values(rawData.bitTitle as Record<string, TaskBitTitle>) : [];
    const bitTitle: TaskBitTitle[] = bitTitleArray.map((item: TaskBitTitle) => ({
      id: item.id,
      name: item.name,
      subTitleIds: item.subTitleIds,
      iconFrame: item.iconFrame,
    }));

    const subTitleArray = rawData.subTitle && typeof rawData.subTitle === 'object' ? Object.values(rawData.subTitle as Record<string, TaskSubTitle>) : [];
    const subTitle: TaskSubTitle[] = subTitleArray.map((item: TaskSubTitle) => ({
      subTitleId: item.subTitleId,
      name: item.name,
      areas: item.areas,
    }));

    const areaConfigArray = rawData.areaConfig && typeof rawData.areaConfig === 'object' ? Object.values(rawData.areaConfig as Record<string, TaskAreaConfig>) : [];
    const areaConfig: TaskAreaConfig[] = areaConfigArray.map((item: TaskAreaConfig) => ({
      id: item.id,
      name: item.name,
    }));

    const npcNames: TaskNpcName = typeof rawData.npcNames === 'object' ? rawData.npcNames : {};
    const orderInArea = typeof rawData.orderInArea === 'object' ? rawData.orderInArea : {};

    cachedTasks = {
      defines,
      starters,
      bitTitle,
      subTitle,
      areaConfig,
      orderInArea,
      npcNames,
    };

    console.log(`成功解析并缓存了 ${defines.length} 个任务定义和 ${starters.length} 个任务启动器`);
    return true;
  } catch (error) {
    console.error('解析任务数据时出错:', error);
    return false;
  }
}

/**
 * 获取所有任务数据。
 * @returns {TaskData | null} 缓存的任务数据。
 */
export function getTaskData() {
  return cachedTasks;
}

/**
 * 根据ID获取任务定义。
 * @param {number} id - 任务ID。
 * @returns {TaskDefine | undefined} 找到的任务定义，否则为undefined。
 */
export function getTaskDefineById(id: number) {
  return cachedTasks?.defines.find(d => d.taskId === id);
}

/**
 * 根据ID获取任务启动器。
 * @param {number} id - 任务ID。
 * @returns {TaskStarter | undefined} 找到的任务启动器，否则为undefined。
 */
export function getTaskStarterById(id: number) {
  return cachedTasks?.starters.find(s => s.taskId === id);
}