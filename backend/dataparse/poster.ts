import type { Poster, RawPosterData } from '../types/poster';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let posterList: Poster[] = [];
const labelMap: Map<number, string> = new Map();

/**
 * 构造海报URL
 * @param {string|number} id - 海报ID
 * @returns {string} - 构造的海报URL
 */
export function constructPosterUrl(id: string | number): string {
  if (!id) {
    throw new Error('海报ID不能为空');
  }
  // 构造标准海报URL
  return `${URL_CONFIG.posterBackgroundPrefix}/img_petskinbackground_${id}.png`;
}

/**
 * 解析 PetSkinClassifyInfoConfig 以提取标签ID和名称的映射
 * @param jsContent - gamemain.js 的内容
 */
function parseLabelConfig(jsContent: string) {
  const configRegex =
    /PetSkinClassifyInfoConfig\.L_CHINESE_NAME_MAP\[PetSkinClassifyInfoConfig\.(L_[A-Z_0-9]+)\] = "([^"]+)";/g;
  const idRegex = /PetSkinClassifyInfoConfig\.(L_[A-Z_0-9]+) = (\d+);/g;
  const tempNameMap: Map<string, string> = new Map();
  const idMap: Map<string, number> = new Map();
  let match;

  while ((match = configRegex.exec(jsContent)) !== null) {
    tempNameMap.set(match[1], match[2]);
  }

  while ((match = idRegex.exec(jsContent)) !== null) {
    idMap.set(match[1], parseInt(match[2], 10));
  }

  for (const [key, name] of tempNameMap.entries()) {
    if (idMap.has(key)) {
      labelMap.set(idMap.get(key)!, name);
    }
  }
}

/**
 * 从游戏主JS文件获取皮肤和海报数据
 * @param jsContent - gamemain.js 的内容
 * @returns {RawPosterData[]} - 包含海报信息的数组
 */
function createRawPosterFromArgs(args: any[]): RawPosterData | null {
  try {
    const [
      id,
      name,
      labelId,
      skinId,
      hasBackground,
      showPet,
      hasTalk,
      extendsInfo,
      description,
      isNormalPet,
      isSwitchPackageBG,
      isInteractSkin,
      needVerification,
      isFightMusic = false,
      isHuanDong = false,
      hasPackageSkinState = false,
    ] = args;

    if (!skinId || !hasBackground) {
      return null; // 不是有效的海报
    }

    return {
      id,
      name: name.replace(/\([^)]*\)/g, '').trim(),
      labelId,
      skinId: String(skinId),
      hasBackground,
      showPet,
      hasTalk,
      extendsInfo: extendsInfo || [],
      description,
      isNormalPet,
      isSwitchPackageBG,
      isInteractSkin,
      needVerification,
      isFightMusic,
      isHuanDong,
      hasPackageSkinState,
    };
  } catch {
    return null;
  }
}

function fetchRawPosterData(jsContent: string): RawPosterData[] {
  const rawPosters: RawPosterData[] = [];
  const dataArrayStartIndex = jsContent.indexOf('PetSkinConfig.DATAS = [');
  if (dataArrayStartIndex === -1) {
    throw new Error('找不到PetSkinConfig.DATAS数组');
  }

  const dataArrayEndIndex = jsContent.indexOf(';', dataArrayStartIndex);
  const dataArrayText = jsContent.substring(dataArrayStartIndex, dataArrayEndIndex);

  const regex = /new.*?\((\s*.*?\s*)\)/g;
  let match;

  while ((match = regex.exec(dataArrayText)) !== null) {
    try {
      const argsString = match[1];
      const args = JSON.parse(
        `[${argsString.replace(/_PetSkinClassifyInfoConfig[^,]+?,/g, '0,')}]`
      );
      const newPoster = createRawPosterFromArgs(args);
      if (newPoster) {
        rawPosters.push(newPoster);
      }
    } catch {
      // 忽略无法解析的行
    }
  }

  return rawPosters.sort((a, b) => a.id - b.id);
}

/**
 * 初始化海报数据模块
 * @returns {Promise<void>}
 */
export async function initPosterModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    parseLabelConfig(jsContent);
    const rawData = fetchRawPosterData(jsContent);

    posterList = rawData
      .filter((p) => p && p.id && !isNaN(p.id))
      .map((p) => ({
        ...p,
        labelName: labelMap.get(p.labelId) || '未知',
      }));
  } catch (error) {
    console.error('海报数据模块初始化失败:', error);
  }
}

/**
 * 获取所有海报数据
 * @returns {Poster[]}
 */
export function getAllPosters(): Poster[] {
  return posterList;
}

/**
 * 根据ID获取海报数据
 * @param {number} id - 海报ID
 * @returns {Poster | undefined}
 */
export function getPosterById(id: number): Poster | undefined {
  return posterList.find((p) => p.id === id);
}
