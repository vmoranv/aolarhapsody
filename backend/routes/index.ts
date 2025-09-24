/**
 * @fileoverview
 * This file serves as the entry point for all routes in the application.
 * It imports all route modules and exports them as an array.
 *
 * 路由注册顺序说明：
 * 1. 数据转换和现有活动相关路由
 * 2. 核心数据列表路由
 * 3. 特殊系统功能路由
 * 4. 监控和管理路由
 * 5. 海报和兑换相关路由
 * 6. 随机名称和羁绊相关路由
 * 7. 增益和宝箱相关路由
 *
 * 注意：路由顺序可能影响中间件处理和路径匹配，
 * 请在添加新路由时考虑现有顺序的逻辑。
 */

import astralSpiritRoutes from './astralspirit';
import buffRoutes from './buff';
import miscellaneousRoutes from './chatframe';
import clothesRoutes from './clothes';
import commonBuffRoutes from './commonbuff';
import converterRoutes from './converter';
import crystalKeyRoutes from './crystalkey';
import existingActivityRoutes from './existingactivity';
import fetterRoutes from './fetter';
import galaxyFleetMarkRoutes from './galaxyfleetmark';
import godCardRoutes from './godcard';
import headFrameRoutes from './headframe';
import hkRoutes from './hk';
import headIconRoutes from './icondata';
import inscriptionRoutes from './inscription';
import itemRoutes from './item';
import itemChestRoutes from './itemchest';
import miracleRoutes from './miracle';
import monitorRoutes from './monitor';
import petCardRoutes from './petcard';
import petCard2Routes from './petcard2';
import petDictionaryRoutes from './petdictionary';
import petExchangeRoutes from './petexchange';
import petSkinRoutes from './petskin';
import petStoneRoutes from './petstone';
import petTalkRoutes from './pettalk';
import petTerritoryFightRoutes from './petterritoryfight';
import pmRoutes from './pmdatalist';
import spEvoRoutes from './pmevolink';
import posterRoutes from './poster';
import randomNameRoutes from './randomname';
import recommendNameRoutes from './recommendname';
import sanctuaryEffectsRoutes from './sanctuaryeffects';
import summonerRoutes from './summoner';
import taskRoutes from './task';
import titleRoutes from './title';
import toteRoutes from './tote';

/**
 * 导出所有路由的数组，按功能和依赖关系排序
 *
 * 排序原则：
 * 1. 基础数据服务优先
 * 2. 核心游戏功能居中
 * 3. 特殊功能和工具靠后
 * 4. 监控和管理功能最后
 *
 * @type {Array} 包含所有路由处理器的数组
 */
export default [
  converterRoutes,
  existingActivityRoutes,
  pmRoutes,
  astralSpiritRoutes,
  clothesRoutes,
  headFrameRoutes,
  headIconRoutes,
  galaxyFleetMarkRoutes,
  spEvoRoutes,
  miscellaneousRoutes,
  crystalKeyRoutes,
  godCardRoutes,
  hkRoutes,
  itemRoutes,
  inscriptionRoutes,
  miracleRoutes,
  summonerRoutes,
  petStoneRoutes,
  petCard2Routes,
  petCardRoutes,
  petDictionaryRoutes,
  petTalkRoutes,
  petTerritoryFightRoutes,
  taskRoutes,
  titleRoutes,
  toteRoutes,
  monitorRoutes,
  posterRoutes,
  petExchangeRoutes,
  randomNameRoutes,
  fetterRoutes,
  commonBuffRoutes,
  itemChestRoutes,
  sanctuaryEffectsRoutes,
  buffRoutes,
  recommendNameRoutes,
  petSkinRoutes,
];
