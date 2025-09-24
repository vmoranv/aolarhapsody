import { PetSkinInfo } from '../types';
import { URL_CONFIG } from '../types/urlconfig';
import { fetchJavaScriptFile } from './gamedataparser';

let petSkinCache: PetSkinInfo[] = [];

/**
 * 解析 PetSkinConfig.DATAS 数据
 * @param jsContent - JavaScript 文件内容
 * @returns 解析后的 PetSkinInfo 数组
 */
function parsePetSkinConfig(jsContent: string): PetSkinInfo[] {
  const mainRegex = /PetSkinConfig\.DATAS\s*=\s*\[([\s\S]*?)\];/;
  const mainMatch = jsContent.match(mainRegex);

  if (!mainMatch || !mainMatch[1]) {
    return [];
  }

  const dataContent = mainMatch[1];
  const itemRegex = /new _PetSkinInfo__WEBPACK_IMPORTED_MODULE_0__\["default"\]\((.*?)\)/g;
  const matches = [...dataContent.matchAll(itemRegex)];

  return matches.map((match) => {
    const argsString = match[1];
    const argRegex = /(?:"[^"]*"|'[^']*'|\[.*?\]|[^,]+)/g;
    const args = (argsString.match(argRegex) || []).map((arg) => {
      const trimmedArg = arg.trim();
      if (trimmedArg.startsWith('"') && trimmedArg.endsWith('"')) {
        return JSON.parse(trimmedArg);
      }
      if (trimmedArg.startsWith("'") && trimmedArg.endsWith("'")) {
        return trimmedArg.slice(1, -1);
      }
      if (trimmedArg === 'true') {
        return true;
      }
      if (trimmedArg === 'false') {
        return false;
      }
      if (trimmedArg.startsWith('[')) {
        try {
          return JSON.parse(trimmedArg);
        } catch {
          return [];
        }
      }
      // Handle variables like _PetSkinClassifyInfoConfig__WEBPACK_IMPORTED_MODULE_1__["default"].至臻
      if (trimmedArg.includes('_PetSkinClassifyInfoConfig')) {
        return 0; // Placeholder value
      }
      return Number(trimmedArg);
    });

    return {
      id: (args[0] as number) || 0,
      name: (args[1] as string) || '',
      labelId: (args[2] as number) || 0,
      skinId: (args[3] as number) || 0,
      hasBackground: (args[4] as boolean) || false,
      showPet: (args[5] as boolean) || false,
      isNormalPet: (args[6] as boolean) || false,
      extendsInfo: (args[7] as number[]) || null,
      tuJianId: (args[8] as string) || '',
      hasTalk: (args[9] as boolean) || false,
      isSwitchPackageBG: (args[10] as boolean) || false,
      isInteractSkin: (args[11] as boolean) || false,
      hasInbetweening: (args[12] as boolean) || false,
      isCaiDanSkin: (args[13] as boolean) || false,
      hasPackageSkinState: (args[14] as boolean) || false,
      isFightMusic: (args[15] as boolean) || false,
      needVerification: (args[16] as boolean) || false,
      huanCaiRaceIdArr: (args[17] as number[]) || null,
      isShowMeInPetSkinBook: (args[18] as boolean) || false,
      needFullBattle: (args[19] as boolean) || false,
      isHuanHuaSkin: (args[20] as boolean) || false,
    };
  });
}

/**
 * 获取所有宠物皮肤信息
 * @returns 宠物皮肤信息数组
 */
export function getPetSkins(): PetSkinInfo[] {
  return petSkinCache;
}

/**
 * 根据ID获取单个宠物皮肤信息
 * @param id - 宠物皮肤ID
 * @returns 单个宠物皮肤信息或undefined
 */
export function getPetSkinById(id: number): PetSkinInfo | undefined {
  return petSkinCache.find((skin) => skin.id === id);
}

/**
 * 初始化宠物皮肤模块，预先加载和缓存数据
 */
export async function initPetSkinModule(): Promise<void> {
  try {
    const jsContent = await fetchJavaScriptFile(URL_CONFIG.gameMainJs);
    petSkinCache = parsePetSkinConfig(jsContent);
  } catch (error) {
    console.error('初始化宠物皮肤模块时出错:', error);
    petSkinCache = [];
  }
}
