// 导入必要的模块
import express, { Express, Request, Response } from 'express';
import cors from 'cors';

// 导入数据初始化模块
import { initPetDataModule } from './dataparse/pmdatalist';
import { initAstralSpiritDataModule } from './dataparse/astralspirit';
import { initClothesModule } from './dataparse/clothes';
import { initHeadFrameModule } from './dataparse/headframe';
import { initIconModule } from './dataparse/icondata';
import { initGalaxyFleetMarkModule } from './dataparse/galaxyfleetmark';
import { initSpEvoModule } from './dataparse/pmevolink';
import { initChatFrameModule } from './dataparse/chatframe';
import { initCrystalKeyModule } from './dataparse/crystalkey';
import { initGodCardModule } from './dataparse/godcard';
import { initHkModule } from './dataparse/hk';
import { initItemModule } from './dataparse/item';
import { initInscriptionModule } from './dataparse/inscription';
import { initMiracleModule } from './dataparse/miracle';
import { initSummonerModule } from './dataparse/summoner';
import { initPetStoneModule } from './dataparse/petstone';
import { initPetCard2Module } from './dataparse/petcard2';
import { initPetCardModule } from './dataparse/petcard';
import { initPetDictionaryModule } from './dataparse/petdictionary';
import { initPetTalkModule } from './dataparse/pettalk';
import { initPetTerritoryFightModule } from './dataparse/petterritoryfight';
import { initTaskModule } from './dataparse/task';
import { initTitleModule } from './dataparse/title';
import { initToteModule } from './dataparse/tote';

// 导入路由模块
import pmRoutes from './routes/pmdatalist';
import astralSpiritRoutes from './routes/astralspirit';
import clothesRoutes from './routes/clothes';
import headFrameRoutes from './routes/headframe';
import headIconRoutes from './routes/icondata';
import galaxyFleetMarkRoutes from './routes/galaxyfleetmark';
import spEvoRoutes from './routes/pmevolink';
import miscellaneousRoutes from './routes/chatframe';
import crystalKeyRoutes from './routes/crystalkey';
import godCardRoutes from './routes/godcard';
import hkRoutes from './routes/hk';
import itemRoutes from './routes/item';
import inscriptionRoutes from './routes/inscription';
import miracleRoutes from './routes/miracle';
import summonerRoutes from './routes/summoner';
import petStoneRoutes from './routes/petstone';
import petCard2Routes from './routes/petcard2';
import petCardRoutes from './routes/petcard';
import petDictionaryRoutes from './routes/petdictionary';
import petTalkRoutes from './routes/pettalk';
import petTerritoryFightRoutes from './routes/petterritoryfight';
import taskRoutes from './routes/task';
import titleRoutes from './routes/title';
import toteRoutes from './routes/tote';

// 导入类型定义
import { AstralSpirit, AstralSpiritSuit } from './types/astralspirit';
import { Pet, Weather, Skill, SkillAttribute, ProcessedAttribute } from './types/pmdatalist';
import { Clothes, ClothesSuit, ClothesAffectBody, ClothesPart } from './types/clothes';
import { HeadFrame } from './types/headframe';
import { PetIcon, HeadIcon } from './types/icondata';
import { GalaxyFleetMark } from './types/galaxyfleetmark';
import { SpEvo } from './types/pmevolink';
import { ChatFrame } from './types/chatframe';
import { CrystalKey } from './types/crystalkey';
import { GodCard, GodCardSuit } from './types/godcard';
import { HKData, HKBuff } from './types/hk';
import { Item } from './types/item';
import { Inscription } from './types/inscription';
import { MiraclePetAwakeData, MiraclePetInfo, MiraclePetBreakData } from './types/miracle';
import { SummonerSkillDataConfig } from './types/summoner';
import { EvolutionStone, SkillStone } from './types/petstone';
import { PetCard2 } from './types/petcard2';
import { PetCard, PetCardSuit } from './types/petcard';
import { PetDictionaryDataItem } from './types/petdictionary';
import { PetTalk } from './types/pettalk';
import { PetTerritoryFight } from './types/petterritoryfight';
import { TaskData, TaskDefine, TaskStarter, TaskBitTitle, TaskSubTitle, TaskAreaConfig, TaskNpcName } from './types/task';
import { Title, TitleConfig } from './types/title';
import { Tote, ToteData, ToteEntryData, ToteValueData } from './types/tote';

// 导出所有类型
export type { AstralSpirit, AstralSpiritSuit, Pet, Weather, Skill, SkillAttribute, ProcessedAttribute, Clothes, ClothesSuit, ClothesAffectBody, ClothesPart, HeadFrame, PetIcon, HeadIcon, GalaxyFleetMark, SpEvo, ChatFrame, CrystalKey, GodCard, GodCardSuit, HKData, HKBuff, Item, Inscription, MiraclePetAwakeData, MiraclePetInfo, MiraclePetBreakData, SummonerSkillDataConfig, EvolutionStone, SkillStone, PetCard2, PetCard, PetCardSuit, PetDictionaryDataItem, PetTalk, PetTerritoryFight, TaskData, TaskDefine, TaskStarter, TaskBitTitle, TaskSubTitle, TaskAreaConfig, TaskNpcName, Title, TitleConfig, Tote, ToteData, ToteEntryData, ToteValueData };

// 创建Express应用
const app: Express = express();
const port = 3000;

// 为所有路由启用CORS
app.use(cors());
// 解析JSON请求体
app.use(express.json());

// 根路由端点
app.get('/', (req: Request, res: Response) => {
  res.send('你好，世界！');
});

// 使用路由
app.use('/api', pmRoutes);
app.use('/api', astralSpiritRoutes);
app.use('/api', clothesRoutes);
app.use('/api', headFrameRoutes);
app.use('/api', headIconRoutes);
app.use('/api', galaxyFleetMarkRoutes);
app.use('/api', spEvoRoutes);
app.use('/api', miscellaneousRoutes);
app.use('/api', crystalKeyRoutes);
app.use('/api', godCardRoutes);
app.use('/api', hkRoutes);
app.use('/api', itemRoutes);
app.use('/api', inscriptionRoutes);
app.use('/api', miracleRoutes);
app.use('/api', summonerRoutes);
app.use('/api', petStoneRoutes);
app.use('/api', petCard2Routes);
app.use('/api', petCardRoutes);
app.use('/api', petDictionaryRoutes);
app.use('/api', petTalkRoutes);
app.use('/api', petTerritoryFightRoutes);
app.use('/api', taskRoutes);
app.use('/api', titleRoutes);
app.use('/api', toteRoutes);

// =================================
// 服务器启动
// =================================
async function startServer() {
  // 初始化所有数据模块
  console.log('正在初始化亚比数据模块...');
  const petDataSuccess = await initPetDataModule();
  if (petDataSuccess) {
    console.log('亚比数据模块初始化成功。');
  } else {
    console.error('亚比数据模块初始化失败！服务将以无亚比数据的状态启动。');
  }

  console.log('正在初始化星灵数据模块...');
  const astralSpiritSuccess = await initAstralSpiritDataModule();
  if (astralSpiritSuccess) {
    console.log('星灵数据模块初始化成功。');
  } else {
    console.error('星灵数据模块初始化失败！');
  }

  console.log('正在初始化服装数据模块...');
  const clothesSuccess = await initClothesModule();
  if (clothesSuccess) {
    console.log('服装数据模块初始化成功。');
  } else {
    console.error('服装数据模块初始化失败！');
  }

  console.log('正在初始化头像框数据模块...');
  const headFrameSuccess = await initHeadFrameModule();
  if (headFrameSuccess) {
    console.log('头像框数据模块初始化成功。');
  } else {
    console.error('头像框数据模块初始化失败！');
  }

  console.log('正在初始化图标数据模块...');
  const iconSuccess = await initIconModule();
  if (iconSuccess) {
    console.log('图标数据模块初始化成功。');
  } else {
    console.error('图标数据模块初始化失败！');
  }

  console.log('正在初始化银河舰队徽章数据模块...');
  const galaxyFleetMarkSuccess = await initGalaxyFleetMarkModule();
  if (galaxyFleetMarkSuccess) {
    console.log('银河舰队徽章数据模块初始化成功。');
  } else {
    console.error('银河舰队徽章数据模块初始化失败！');
  }

  console.log('正在初始化特殊进化数据模块...');
  const spEvoSuccess = await initSpEvoModule();
  if (spEvoSuccess) {
    console.log('特殊进化数据模块初始化成功。');
  } else {
    console.error('特殊进化数据模块初始化失败！');
  }

  console.log('正在初始化聊天框数据模块...');
  const chatFrameSuccess = await initChatFrameModule();
  if (chatFrameSuccess) {
    console.log('聊天框数据模块初始化成功。');
  } else {
    console.error('聊天框数据模块初始化失败！');
  }

  console.log('正在初始化晶钥数据模块...');
  const crystalKeySuccess = await initCrystalKeyModule();
  if (crystalKeySuccess) {
    console.log('晶钥数据模块初始化成功。');
  } else {
    console.error('晶钥数据模块初始化失败！');
  }

  console.log('正在初始化神兵数据模块...');
  const godCardSuccess = await initGodCardModule();
  if (godCardSuccess) {
    console.log('神兵数据模块初始化成功。');
  } else {
    console.error('神兵数据模块初始化失败！');
  }

  console.log('正在初始化魂卡数据模块...');
  const hkDataSuccess = await initHkModule();
  if (hkDataSuccess) {
    console.log('魂卡数据模块初始化成功。');
  } else {
    console.error('魂卡数据模块初始化失败！');
  }

  console.log('正在初始化道具数据模块...');
  const itemSuccess = await initItemModule();
  if (itemSuccess) {
    console.log('道具数据模块初始化成功。');
  } else {
    console.error('道具数据模块初始化失败！');
  }

  console.log('正在初始化铭文数据模块...');
  const inscriptionSuccess = await initInscriptionModule();
  if (inscriptionSuccess) {
    console.log('铭文数据模块初始化成功。');
  } else {
    console.error('铭文数据模块初始化失败！');
  }

  console.log('正在初始化奇迹数据模块...');
  const miracleSuccess = await initMiracleModule();
  if (miracleSuccess) {
    console.log('奇迹数据模块初始化成功。');
  } else {
    console.error('奇迹数据模块初始化失败！');
  }

  console.log('正在初始化召唤师技能数据模块...');
  const summonerSkillSuccess = await initSummonerModule();
  if (summonerSkillSuccess) {
    console.log('召唤师技能数据模块初始化成功。');
  } else {
    console.error('召唤师技能数据模块初始化失败！');
  }

  console.log('正在初始化进化石数据模块...');
  const petStoneSuccess = await initPetStoneModule();
  if (petStoneSuccess) {
    console.log('进化石数据模块初始化成功。');
  } else {
    console.error('进化石数据模块初始化失败！');
  }

  console.log('正在初始化特性晶石数据模块...');
  const petCard2Success = await initPetCard2Module();
  if (petCard2Success) {
    console.log('特性晶石数据模块初始化成功。');
  } else {
    console.error('特性晶石数据模块初始化失败！');
  }

  console.log('正在初始化装备数据模块...');
  const petCardSuccess = await initPetCardModule();
  if (petCardSuccess) {
    console.log('装备数据模块初始化成功。');
  } else {
    console.error('装备数据模块初始化失败！');
  }

  console.log('正在初始化亚比图鉴数据模块...');
  const petDictionarySuccess = await initPetDictionaryModule();
  if (petDictionarySuccess) {
    console.log('亚比图鉴数据模块初始化成功。');
  } else {
    console.error('亚比图鉴数据模块初始化失败！');
  }

  console.log('正在初始化亚比语音数据模块...');
  const petTalkSuccess = await initPetTalkModule();
  if (petTalkSuccess) {
    console.log('亚比语音数据模块初始化成功。');
  } else {
    console.error('亚比语音数据模块初始化失败！');
  }

  console.log('正在初始化领域数据模块...');
  const petTerritoryFightSuccess = await initPetTerritoryFightModule();
  if (petTerritoryFightSuccess) {
    console.log('领域数据模块初始化成功。');
  } else {
    console.error('领域数据模块初始化失败！');
  }

  console.log('正在初始化任务数据模块...');
  const taskSuccess = await initTaskModule();
  if (taskSuccess) {
    console.log('任务数据模块初始化成功。');
  } else {
    console.error('任务数据模块初始化失败！');
  }

  console.log('正在初始化称号数据模块...');
  const titleSuccess = await initTitleModule();
  if (titleSuccess) {
    console.log('称号数据模块初始化成功。');
  } else {
    console.error('称号数据模块初始化失败！');
  }

  console.log('正在初始化魂器数据模块...');
  const toteSuccess = await initToteModule();
  if (toteSuccess) {
    console.log('魂器数据模块初始化成功。');
  } else {
    console.error('魂器数据模块初始化失败！');
  }

  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });
}

startServer();