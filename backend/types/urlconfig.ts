/**
 * 基础URL配置
 */
const BASE_URL = 'https://aola.100bt.com';
const H5_BASE_URL = `${BASE_URL}/h5`;
const DATA_PREFIX = `${H5_BASE_URL}/data`; // JSON数据文件前缀
const JS_PREFIX = `${H5_BASE_URL}/js`; // JavaScript文件前缀
const PLAY_PREFIX = `${BASE_URL}/play`; // XML文件前缀

/**
 * 游戏内各种数据资源的URL配置对象
 * 集中管理所有外部数据源的URL，方便维护和修改。
 */
export const URL_CONFIG = {
  petIconPrefix: `${H5_BASE_URL}/peticon`,
  petEggPrefix: `${H5_BASE_URL}/petegg`,
  posterBackgroundPrefix: `${H5_BASE_URL}/pet/petskin/background/bg`,
  sceneItem: `${PLAY_PREFIX}/sceneitem.xml`,
  astralSpirit: `${DATA_PREFIX}/astralspiritdata.json`,
  chatFrame: `${DATA_PREFIX}/chatframedata.json`,
  clothesData: `${DATA_PREFIX}/clothesdata.json`,
  clothesPart: `${DATA_PREFIX}/clothespartdata_des.json`,
  crystalKey: `${DATA_PREFIX}/crystalkeydata.json`,
  galaxyFleetMark: `${DATA_PREFIX}/galaxygleetmarkdata.json`,
  godCard: `${DATA_PREFIX}/godcarddata.json`,
  headFrame: `${DATA_PREFIX}/headframedata.json`,
  hk: `${DATA_PREFIX}/hkdata.json`,
  petIcon: `${DATA_PREFIX}/peticondata.json`,
  headIcon: `${DATA_PREFIX}/headicondata.json`,
  inscription: `${DATA_PREFIX}/inscriptiondata.json`,
  item: `${DATA_PREFIX}/itemdata.json`,
  miracle: `${DATA_PREFIX}/miracledata.json`,
  petCard: `${DATA_PREFIX}/petcarddata.json`,
  petCard2: `${DATA_PREFIX}/petcard2data.json`,
  petDictionary: `${DATA_PREFIX}/petdictionarydata.json`,
  petStone: `${DATA_PREFIX}/petstonedata.json`,
  petTalk: `${DATA_PREFIX}/pettalkdata.json`,
  petTerritoryFight: `${DATA_PREFIX}/petterritoryfightdata.json`,
  pmDataList: `${DATA_PREFIX}/pmdatalist.json`,
  gameMainJs: `${JS_PREFIX}/gamemain.js`,
  pmEvoLink: `${DATA_PREFIX}/pmevolinkdata.json`,
  summoner: `${DATA_PREFIX}/summonerconfig.json`,
  task: `${DATA_PREFIX}/taskdata.json`,
  title: `${DATA_PREFIX}/title.json`,
  tote: `${DATA_PREFIX}/totedata.json`,
  yabiJs: 'http://www.100bt.com/aola/act/zt-friend/res/js/yabi.js?__rev=20250912',
  // API 端点配置
  api: {
    userService: 'http://service-aola.100bt.com/aolashare/otherinfo.jsp',
    friendPage: 'http://www.100bt.com/aola/act/zt-friend/',
  },
};
