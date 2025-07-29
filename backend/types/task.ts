/**
 * 表示任务定义
 */
export interface TaskDefine {
  /** 任务ID */
  taskId: number;
  /** 任务类型 */
  type: number;
  /** 扩展数据 */
  extData: number[];
}

/**
 * 表示任务触发器
 */
export interface TaskStarter {
  /** 任务ID */
  taskId: number;
  /** 触发器类型 */
  type: number;
  /** 扩展数据 */
  extData: string;
  /** 前置字符串 */
  preString: string;
  /** 是否在线 */
  isOnline: number;
  /** 任务名称 */
  taskName: string;
  /** 线路 */
  line: number;
  /** 区域 */
  area: number;
}

/**
 * 表示任务大标题
 */
export interface TaskBitTitle {
  /** 标题ID */
  id: number;
  /** 标题名称 */
  name: string;
  /** 子标题ID列表 */
  subTitleIds: number[];
  /** 图标框 */
  iconFrame: number;
}

/**
 * 表示任务子标题
 */
export interface TaskSubTitle {
  /** 子标题ID */
  subTitleId: number;
  /** 子标题名称 */
  name: string;
  /** 区域列表 */
  areas: number[];
}

/**
 * 表示任务区域配置
 */
export interface TaskAreaConfig {
  /** 区域ID */
  id: number;
  /** 区域名称 */
  name: string;
}

/**
 * 表示任务NPC名称
 */
export interface TaskNpcName {
  [id: string]: string;
}

/**
 * 表示完整的任务数据
 */
export interface TaskData {
  /** 任务定义列表 */
  defines: TaskDefine[];
  /** 任务触发器列表 */
  starters: TaskStarter[];
  /** 任务大标题列表 */
  bitTitle: TaskBitTitle[];
  /** 任务子标题列表 */
  subTitle: TaskSubTitle[];
  /** 任务区域配置列表 */
  areaConfig: TaskAreaConfig[];
  /** 区域排序 */
  orderInArea: Record<string, unknown>;
  /** NPC名称映射 */
  npcNames: TaskNpcName;
}