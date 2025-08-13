import { URL_CONFIG } from '../types/url';
import { fetchData, fetchDataItem } from './api';
import { PetListItem } from './pet-helper';

/**
 * 表示亚比图鉴数据项
 */
export interface PetDictionaryDataItem {
  /** 亚比ID */
  petID: number;
  /** 亚比名称 */
  petName: string;
  /** 亚比身高 */
  petHeight: string;
  /** 亚比体重 */
  petWeight: string;
  /** 防御属性 */
  defAttribute: string;
  /** 攻击属性 */
  attAttribute: string;
  /** 进化等级 */
  evolutionLevel: string;
  /** 是否为新 */
  isNew: string;
  /** 是否稀有 */
  isRare: string;
  /** 位置 */
  loc: string;
  /** 获取方式 */
  getWay: string;
  /** 亚比喜好 */
  petFavourite: string;
  /** 亚比介绍 */
  petIntro: string;
  /** 地点 */
  locations: string;
  /** 是否可获得 */
  securable: string;
  /** 是否为热门亚比 */
  isHotPet: string;
  /** 是否为王者亚比 */
  isKingPet: string;
  /** 是否可评论 */
  canComment: string;
  /** 是否为亚比皮肤 */
  isPetSkin: string;
  /** 皮肤种族ID */
  skinRaceId: string;
  /** 任务ID */
  taskId: string;
  /** 亚比时代信息 */
  petEra?: {
    eraName: 'legend' | 'degenerator' | 'xinghui' | 'gq';
    systemName: string;
    displayName: string;
    typeId: number;
  };
}

/**
 * 亚比图鉴数据类型
 */
export type PetDictionaryData = PetDictionaryDataItem;

/**
 * 定义计算结果中单个属性的接口
 */
interface StatInfo {
  value: number;
  percent: number;
  display: string;
}

/**
 * 定义处理后的亚比图鉴属性信息
 */
export interface PetDictionaryStatInfo {
  height: StatInfo;
  weight: StatInfo;
}

/**
 * 获取亚比图鉴列表
 * @returns 返回所有亚比图鉴项的数组
 */
export async function fetchPetDictionaryList(): Promise<PetDictionaryData[]> {
  return fetchData<PetDictionaryData>('petdictionary');
}

/**
 * 根据ID获取单个亚比图鉴数据
 * @param id 亚比ID
 * @returns 返回单个亚比的详细图鉴数据
 */
export async function fetchPetDictionaryById(id: number): Promise<PetDictionaryData> {
  return fetchDataItem<PetDictionaryData>('petdictionary', id.toString());
}

/**
 * 计算亚比图鉴中的属性信息，用于UI展示
 * @param pet 亚比图鉴数据
 * @returns 计算后的属性信息，包含数值、百分比和显示文本
 */
export function calculateDictionaryStatInfo(pet: PetDictionaryData): PetDictionaryStatInfo | null {
  if (!pet) {
    return null;
  }

  const height = parseFloat(pet.petHeight) || 0;
  const weight = parseFloat(pet.petWeight) || 0;

  // 基准值，可根据所有亚比的最大值进行调整
  const maxHeight = 300; // 假设最大身高300cm
  const maxWeight = 200; // 假设最大体重200kg

  return {
    height: {
      value: height,
      percent: Math.min((height / maxHeight) * 100, 100),
      display: height ? `${height} cm` : '未知',
    },
    weight: {
      value: weight,
      percent: Math.min((weight / maxWeight) * 100, 100),
      display: weight ? `${weight} kg` : '未知',
    },
  };
}

/**
 * 解析亚比的属性字符串
 * @param attributeStr 属性字符串，如 "4,5,10"
 * @returns 解析后的属性ID数组
 */
export function parsePetAttribute(attributeStr: string): number[] {
  if (!attributeStr) {
    return [];
  }
  return attributeStr
    .split(',')
    .filter((id) => id)
    .map((id) => parseInt(id, 10));
}

/**
 * 从获取方式中解析进化来源
 * @param getWay 获取方式字符串
 * @returns 返回包含进化来源ID和名称的对象，如果未找到则返回null
 */
export function parseEvolutionSource(getWay: string): { id: string; name: string } | null {
  if (!getWay) {
    return null;
  }

  const evolutionMatch = getWay.match(/由##(\d+)_(.*?)##进化得来/);
  if (evolutionMatch) {
    return {
      id: evolutionMatch[1],
      name: evolutionMatch[2],
    };
  }

  return null;
}

/**
 * 格式化时间
 * @param seconds 秒数
 * @returns 格式化的时间字符串
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === 0) {
    return '0:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

/**
 * 计算亚比的种族值
 * @param selectedPetRawData 亚比原始数据
 * @param petDictionaryData 亚比图鉴数据
 * @returns 种族值数组
 */
export type StatKey =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'spAttack'
  | 'spDefense'
  | 'speed'
  | 'height'
  | 'weight';

/**
 * 定义单个种族值信息的接口
 */
export interface Stat {
  key: StatKey;
  label: string;
  value: number;
  percent: number;
  display?: string;
}

export const calculateStats = (
  selectedPetRawData: (string | number)[] | undefined,
  petDictionaryData: PetDictionaryData | undefined
): Stat[] => {
  if (!selectedPetRawData || !petDictionaryData) {
    return [];
  }
  const pmd = selectedPetRawData;
  const dict = petDictionaryData;
  const dictStats = calculateDictionaryStatInfo(dict);

  const statsData = {
    hp: Number(pmd[4]) || 0,
    attack: Number(pmd[5]) || 0,
    defense: Number(pmd[6]) || 0,
    spAttack: Number(pmd[7]) || 0,
    spDefense: Number(pmd[8]) || 0,
    speed: Number(pmd[9]) || 0,
  };

  const baseStatKeys: StatKey[] = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed'];
  const baseValues = baseStatKeys.map((key) => statsData[key as keyof typeof statsData]);
  const maxBaseStat = Math.max(...baseValues, 1); // Avoid division by zero

  const getStat = (value: number, max: number) => {
    return { value, percent: max > 0 ? Math.min((value / max) * 100, 100) : 0 };
  };

  const statLabels: { [key: string]: string } = {
    hp: 'HP',
    attack: '攻击',
    defense: '防御',
    spAttack: '特攻',
    spDefense: '特防',
    speed: '速度',
    height: '身高',
    weight: '体重',
  };

  const result: Stat[] = baseStatKeys.map((key) => {
    const value = statsData[key as keyof typeof statsData];
    return { key, label: statLabels[key], ...getStat(value, maxBaseStat) };
  });

  if (dictStats) {
    result.push({
      key: 'height',
      label: statLabels['height'],
      value: dictStats.height.value,
      percent: dictStats.height.percent,
      display: dictStats.height.display,
    });
    result.push({
      key: 'weight',
      label: statLabels['weight'],
      value: dictStats.weight.value,
      percent: dictStats.weight.percent,
      display: dictStats.weight.display,
    });
  }

  return result.filter((s) => s.value !== undefined);
};

/**
 * 设置音频
 * @param audioRef 音频引用
 * @param setAudioState 设置音频状态
 * @param message 消息提示
 */
export const setupAudio = (
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  setAudioState: React.Dispatch<React.SetStateAction<any>>,
  message: any
) => {
  if (!audioRef.current) {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () =>
      setAudioState((s: any) => ({ ...s, isLoading: false, duration: audio.duration }))
    );
    audio.addEventListener('playing', () => setAudioState((s: any) => ({ ...s, isPlaying: true })));
    audio.addEventListener('pause', () => setAudioState((s: any) => ({ ...s, isPlaying: false })));
    audio.addEventListener('ended', () =>
      setAudioState((s: any) => ({ ...s, isPlaying: false, currentTime: 0, progress: 0 }))
    );
    audio.addEventListener('timeupdate', () => {
      if (audio.duration > 0) {
        setAudioState((s: any) => ({
          ...s,
          currentTime: audio.currentTime,
          progress: (audio.currentTime / audio.duration) * 100,
        }));
      }
    });
    audio.addEventListener('error', () => {
      setAudioState((s: any) => ({ ...s, isLoading: false, error: true }));
      message.error('无法加载亚比语音，该亚比可能没有语音');
    });
    audioRef.current = audio;
  }
};

/**
 * 播放音频
 * @param selectedPet 选中的亚比
 * @param audioRef 音频引用
 * @param audioState 音频状态
 * @param setupAudio 设置音频函数
 * @param setAudioState 设置音频状态
 * @param message 消息提示
 */
export const handlePlayAudio = (
  selectedPet: any,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  audioState: any,
  setupAudio: () => void,
  setAudioState: React.Dispatch<React.SetStateAction<any>>,
  message: any
) => {
  if (!selectedPet) {
    return;
  }
  setupAudio();
  const audio = audioRef.current!;
  if (audioState.isPlaying) {
    audio.pause();
  } else {
    const petId = selectedPet.id.toString().replace('_0', '');
    const audioSrc = `${URL_CONFIG.petSoundPrefix}/petsound${petId}.mp3`;
    if (audio.src !== window.location.origin + audioSrc) {
      setAudioState({
        isLoading: true,
        isPlaying: false,
        error: false,
        duration: 0,
        currentTime: 0,
        progress: 0,
      });
      audio.src = audioSrc;
      audio.load();
    }
    audio.play().catch(() => {
      setAudioState((s: any) => ({ ...s, isLoading: false, error: true }));
      message.error('音频播放失败');
    });
  }
};

/**
 * 处理进度条点击
 * @param e 鼠标事件
 * @param audioRef 音频引用
 * @param audioState 音频状态
 * @param progressRef 进度条引用
 */
export const handleProgressClick = (
  e: React.MouseEvent<HTMLDivElement>,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  audioState: any,
  progressRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  if (!audioRef.current || audioState.isLoading || audioState.error || !audioState.duration) {
    return;
  }
  const progressBar = progressRef.current!;
  const rect = progressBar.getBoundingClientRect();
  const clickPosition = (e.clientX - rect.left) / rect.width;
  const newTime = clickPosition * audioState.duration;
  if (!isNaN(newTime)) {
    audioRef.current.currentTime = newTime;
  }
};

/**
 * 下载音频
 * @param selectedPet 选中的亚比
 */
export const handleDownloadAudio = async (
  selectedPet: PetListItem | null,
  message: { error: (msg: string) => void; success: (msg: string) => void }
) => {
  if (selectedPet) {
    const petId = selectedPet.id.toString().replace('_0', '');
    const audioUrl = `${URL_CONFIG.petSoundPrefix}/petsound${petId}.mp3`;
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('音频文件下载失败');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedPet.name}_语音.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('开始下载语音...');
    } catch (error) {
      message.error('下载失败，请稍后重试');
      console.error('下载语音时出错:', error);
    }
  }
};

/**
 * 获取属性名称
 * @param id 属性ID
 * @param attributeNameMap 属性名称映射
 * @returns 属性名称
 */
export const getAttributeName = (
  id: string | number | undefined,
  attributeNameMap: Map<number, string>
): string => {
  if (id === undefined) {
    return '';
  }
  return attributeNameMap.get(Number(id)) || '';
};

/**
 * 生成技能列表的 Collapse items
 * @param selectedPetRawData 亚比原始数据
 * @param isNewSkillSet 是否为新技能组
 * @param generateSkillItems 生成技能项的函数
 * @returns Collapse items
 */
export const generateCollapseSkillItems = (
  selectedPetRawData: (string | number)[] | undefined,
  isNewSkillSet: boolean,
  generateSkillItems: (
    selectedPetRawData: (string | number)[] | undefined,
    isNewSkillSet: boolean
  ) => {
    items: { key: string; label: string; children: string[] | null }[];
    fallback: boolean;
    hasNewSkills: boolean;
    hasOldSkills: boolean;
  }
) => {
  return generateSkillItems(selectedPetRawData, isNewSkillSet);
};

/**
 * 生成搜索选项
 * @param pets 亚比列表
 * @param searchKeyword 搜索关键字
 * @param selectedAttribute 选中的属性
 * @param attributeNameMap 属性名称映射
 * @param handleSelectPet 选择亚比的处理函数
 * @param filterPets 过滤亚比的函数
 * @returns 搜索选项
 */
export const generateSearchOptions = (
  pets: PetListItem[],
  searchKeyword: string,
  selectedAttribute: string,
  filterPets: (
    pets: PetListItem[],
    searchKeyword: string,
    selectedAttribute: string
  ) => PetListItem[]
) => {
  const filteredPets = filterPets(pets, searchKeyword, selectedAttribute);
  return filteredPets.map((pet) => ({
    value: pet.id.toString(),
    pet,
  }));
};
