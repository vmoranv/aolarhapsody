import express, { Express, Request, Response } from 'express';
import {
  initPetDataModule,
  getPetList,
  getPetFullDataById,
  searchPets,
  calculateExp,
  getAllWeathers,
  getWeatherById,
  getSkillById,
  getAttributeRelations,
  fetchAndGetAllSkillAttributes
} from './pmdatalist';
import {
  parseAndCacheAstralSpirits,
  getAllAstralSpirits,
  getAstralSpiritById,
  getAllAstralSpiritSuits,
  getAstralSpiritSuitById
} from './astralspirit';
import cors from 'cors';

const app: Express = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // 添加此行以解析JSON请求体

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// =================================
// 技能属性相关API
// =================================
app.get('/api/skill-attributes', async (req: Request, res: Response) => {
  try {
    const data = await fetchAndGetAllSkillAttributes();
    res.json({
      success: true,
      data: data,
      count: data.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
});

app.get('/api/attribute-relations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const relations = getAttributeRelations();
  let relationsData = relations[id];
  if (!relationsData) {
    return res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的克制关系`,
      timestamp: new Date().toISOString(),
    });
  }

  // 特殊处理ID为1的情况，移除最后的5个描述性元素
  if (id === '1') {
    relationsData = relationsData.slice(0, -5);
  }

  const relationMap: { [key: number]: string } = {};
  relationsData.forEach((value, index) => {
    relationMap[index] = value;
  });

  res.json({
    success: true,
    data: relationMap,
    timestamp: new Date().toISOString(),
  });
});

// =================================
// 亚比图鉴相关API
// =================================

// 获取所有亚比的简要列表
app.get('/api/pets', (req: Request, res: Response) => {
  const petList = getPetList();
  res.json({
    success: true,
    data: petList,
    count: petList.length,
    timestamp: new Date().toISOString(),
  });
});

// 根据关键词搜索亚比
app.get('/api/pets/search', (req: Request, res: Response) => {
  const keyword = req.query.keyword as string;
  const results = searchPets(keyword);
  res.json({
    success: true,
    data: results,
    count: results.length,
    timestamp: new Date().toISOString(),
  });
});

// 获取单个亚比的详细信息
app.get('/api/pet/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const petData = getPetFullDataById(id);

  if (petData) {
    res.json({
      success: true,
      data: petData.rawData, // 直接返回原始数组数据
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的亚比`,
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 经验计算API (使用POST)
// =================================
app.post('/api/exp/calculate', (req: Request, res: Response) => {
  const { petId, currentLevel, currentExp, targetLevel } = req.body;

  if (petId === undefined || currentLevel === undefined || currentExp === undefined || targetLevel === undefined) {
    return res.status(400).json({
      success: false,
      error: '请求体中缺少必要的参数: petId, currentLevel, currentExp, targetLevel',
      timestamp: new Date().toISOString(),
    });
  }

  const result = calculateExp(
    String(petId),
    Number(currentLevel),
    Number(currentExp),
    Number(targetLevel)
  );

  if (result.success) {
    res.json({
      success: true,
      data: { requiredExp: result.requiredExp },
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(400).json({
      success: false,
      error: result.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 场地效果API
// =================================

// 获取所有场地效果
app.get('/api/weathers', (req: Request, res: Response) => {
  const weathers = getAllWeathers();
  res.json({
    success: true,
    data: weathers,
    count: weathers.length,
    timestamp: new Date().toISOString(),
  });
});

// 根据ID获取单个场地效果
app.get('/api/weather/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const weather = getWeatherById(id);

  if (weather) {
    res.json({
      success: true,
      data: weather,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的场地效果`,
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 技能API
// =================================

// 根据ID获取单个技能
app.get('/api/skill/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const skill = getSkillById(id);

  if (skill) {
    res.json({
      success: true,
      data: skill,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的技能`,
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 星灵API
// =================================
app.get('/api/astral-spirits', (req: Request, res: Response) => {
  const spirits = getAllAstralSpirits();
  res.json({
    success: true,
    data: spirits,
    count: spirits.length,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/astral-spirit/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const spirit = getAstralSpiritById(id);

  if (spirit) {
    res.json({
      success: true,
      data: spirit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的星灵`,
      timestamp: new Date().toISOString(),
    });
  }
});

app.get('/api/astral-spirit-suits', (req: Request, res: Response) => {
  const suits = getAllAstralSpiritSuits();
  res.json({
    success: true,
    data: suits,
    count: suits.length,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/astral-spirit-suit/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const suit = getAstralSpiritSuitById(id);

  if (suit) {
    res.json({
      success: true,
      data: suit,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的星灵套装`,
      timestamp: new Date().toISOString(),
    });
  }
});

// =================================
// 服务器启动
// =================================
async function startServer() {
  console.log('正在初始化亚比数据模块...');
  const petDataSuccess = await initPetDataModule();
  if (petDataSuccess) {
    console.log('亚比数据模块初始化成功。');
  } else {
    console.error('亚比数据模块初始化失败！服务将以无亚比数据的状态启动。');
  }

  console.log('正在初始化星灵数据模块...');
  const astralSpiritSuccess = await parseAndCacheAstralSpirits();
  if (astralSpiritSuccess) {
    console.log('星灵数据模块初始化成功。');
  } else {
    console.error('星灵数据模块初始化失败！');
  }

  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });
}

startServer();