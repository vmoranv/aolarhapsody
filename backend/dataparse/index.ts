/**
 * @fileoverview
 * This file serves as the entry point for all data parsing modules.
 * It imports and initializes all data modules, and provides a function to reload all data.
 */

import { initAstralSpiritDataModule } from './astralspirit';
import { initBuffModule } from './buff';
import { initChatFrameModule } from './chatframe';
import { initClothesModule } from './clothes';
import { initCommonBuffModule } from './commonbuff';
import { initCrystalKeyModule } from './crystalkey';
import { initFetterModule } from './fetter';
import { initGalaxyFleetMarkModule } from './galaxyfleetmark';
import { initGodCardModule } from './godcard';
import { initHeadFrameModule } from './headframe';
import { initHkModule } from './hk';
import { initIconModule } from './icondata';
import { initInscriptionModule } from './inscription';
import { initItemModule } from './item';
import { initItemChestModule } from './itemchest';
import { initMiracleModule } from './miracle';
import { initPetCardModule } from './petcard';
import { initPetCard2Module } from './petcard2';
import { initPetDictionaryModule } from './petdictionary';
import { initPetExchangeDataModule } from './petexchange';
import { initPetSkinModule } from './petskin';
import { initPetStoneModule } from './petstone';
import { initPetTalkModule } from './pettalk';
import { initPetTerritoryFightModule } from './petterritoryfight';
import { initPetDataModule } from './pmdatalist';
import { initSpEvoModule } from './pmevolink';
import { initPosterModule } from './poster';
import { initRandomNameModule } from './randomname';
import { initRecommendNameModule } from './recommendname';
import { initSanctuaryEffectsModule } from './sanctuaryeffects';
import { initSummonerModule } from './summoner';
import { initTaskModule } from './task';
import { initTitleModule } from './title';
import { initToteModule } from './tote';

export * from './converter';

/**
 * @description An array of all data module initializers.
 */
export const initializers = [
  initPosterModule,
  initPetExchangeDataModule,
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
  initRandomNameModule,
  initFetterModule,
  initCommonBuffModule,
  initItemChestModule,
  initSanctuaryEffectsModule,
  initBuffModule,
  initRecommendNameModule,
  initPetSkinModule,
];

/**
 * @description Reloads all game data by calling all initializers.
 */
export const reloadData = async () => {
  try {
    await Promise.all(initializers.map((init) => init()));
  } catch (error) {
    console.error('重新加载游戏数据时发生错误:', error);
  }
};
