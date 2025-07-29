export interface TaskDefine {
  taskId: number;
  type: number;
  extData: number[];
}

export interface TaskStarter {
  taskId: number;
  type: number;
  extData: string;
  preString: string;
  isOnline: number;
  taskName: string;
  line: number;
  area: number;
}

export interface TaskBitTitle {
  id: number;
  name: string;
  subTitleIds: number[];
  iconFrame: number;
}

export interface TaskSubTitle {
  subTitleId: number;
  name: string;
  areas: number[];
}

export interface TaskAreaConfig {
  id: number;
  name: string;
}

export interface TaskNpcName {
  [id: string]: string;
}

export interface TaskData {
  defines: TaskDefine[];
  starters: TaskStarter[];
  bitTitle: TaskBitTitle[];
  subTitle: TaskSubTitle[];
  areaConfig: TaskAreaConfig[];
  orderInArea: Record<string, unknown>;
  npcNames: TaskNpcName;
}