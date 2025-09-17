import { initAstralSpiritDataModule } from './astralspirit';
import { initChatFrameModule } from './chatframe';
import { initClothesModule } from './clothes';
import { initCrystalKeyModule } from './crystalkey';
import { initGalaxyFleetMarkModule } from './galaxyfleetmark';
import { initGodCardModule } from './godcard';
import { initHeadFrameModule } from './headframe';
import { initHkModule } from './hk';
import { initIconModule } from './icondata';
import { initInscriptionModule } from './inscription';
import { initItemModule } from './item';
import { initMiracleModule } from './miracle';
import { initPetCardModule } from './petcard';
import { initPetCard2Module } from './petcard2';
import { initPetDictionaryModule } from './petdictionary';
import { initPetDataModule } from './petexchange';
import { clearAllUserPetCache, getUserPetDatabaseStats, refreshAllUserPets } from './petexchange';
import { initPetStoneModule } from './petstone';
import { initPetTalkModule } from './pettalk';
import { initPetTerritoryFightModule } from './petterritoryfight';
import { initSpEvoModule } from './pmevolink';
import { initPosterModule } from './poster';
import { initSummonerModule } from './summoner';
import { initTaskModule } from './task';
import { initTitleModule } from './title';
import { initToteModule } from './tote';

export * from './converter';

export const initializers = [
  initPosterModule,
  initPetDataModule,
  initAstralSpiritDataModule,
  initClothesModule,
  initHeadFrameModule,
  initIconModule,
  initGalaxyFleetMarkModule,
  initSpEvoModule,
  initChatFrameModule,
  initCrystalKeyModule,
  initGodCardModule,
  initHkModule,
  initItemModule,
  initInscriptionModule,
  initMiracleModule,
  initSummonerModule,
  initPetStoneModule,
  initPetCard2Module,
  initPetCardModule,
  initPetDictionaryModule,
  initPetTalkModule,
  initPetTerritoryFightModule,
  initTaskModule,
  initTitleModule,
  initToteModule,
];

export const reloadData = async () => {
  try {
    await Promise.all(initializers.map((init) => init()));
  } catch (error) {
    console.error('重新加载游戏数据时发生错误:', error);
  }
};

/**
 * 刷新所有用户宠物信息
 * @param batchSize - 每批处理的用户数量，默认为10
 * @param delay - 批次之间的延迟（毫秒），默认为1000
 */
export const refreshUserPetsData = async (batchSize: number = 10, delay: number = 1000) => {
  try {
    return await refreshAllUserPets(batchSize, delay);
  } catch (error) {
    console.error('刷新用户宠物信息时发生错误:', error);
    throw error;
  }
};

/**
 * 获取用户宠物信息数据库统计信息
 */
export const getUserPetStats = async () => {
  try {
    return await getUserPetDatabaseStats();
  } catch (error) {
    console.error('获取用户宠物统计信息时发生错误:', error);
    throw error;
  }
};

/**
 * 清空所有用户宠物信息缓存
 */
export const clearUserPetCache = async () => {
  try {
    return await clearAllUserPetCache();
  } catch (error) {
    console.error('清空用户宠物缓存时发生错误:', error);
    throw error;
  }
};
