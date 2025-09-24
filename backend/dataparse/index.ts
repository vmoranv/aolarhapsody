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
import { initPetStoneModule } from './petstone';
import { initPetTalkModule } from './pettalk';
import { initPetTerritoryFightModule } from './petterritoryfight';
import { initPetDataModule } from './pmdatalist';
import { initSpEvoModule } from './pmevolink';
import { initPosterModule } from './poster';
import { initSanctuaryEffectsModule } from './sanctuaryeffects';
import { initSummonerModule } from './summoner';
import { initTaskModule } from './task';
import { initTitleModule } from './title';
import { initToteModule } from './tote';

export * from './converter';

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
  initFetterModule,
  initCommonBuffModule,
  initItemChestModule,
  initSanctuaryEffectsModule,
  initBuffModule,
];

export const reloadData = async () => {
  try {
    await Promise.all(initializers.map((init) => init()));
  } catch (error) {
    console.error('重新加载游戏数据时发生错误:', error);
  }
};
