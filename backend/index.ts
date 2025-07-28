import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initPetDataModule } from './pmdatalist';
import { parseAndCacheAstralSpirits } from './astralspirit';
import { parseAndCacheClothes } from './clothes';

import pmRoutes from './routes/pm';
import astralSpiritRoutes from './routes/astralspirit';
import clothesRoutes from './routes/clothes';

import { AstralSpirit, AstralSpiritSuit } from './types/astralspirit';
import { Pet, Weather, Skill, SkillAttribute, ProcessedAttribute } from './types/pmdatalist';
import { Clothes, ClothesSuit, ClothesAffectBody } from './types/clothes';

export type { AstralSpirit, AstralSpiritSuit, Pet, Weather, Skill, SkillAttribute, ProcessedAttribute, Clothes, ClothesSuit, ClothesAffectBody };

const app: Express = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Use routes
app.use('/api', pmRoutes);
app.use('/api', astralSpiritRoutes);
app.use('/api', clothesRoutes);

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

  console.log('正在初始化服装数据模块...');
  const clothesSuccess = await parseAndCacheClothes();
  if (clothesSuccess) {
    console.log('服装数据模块初始化成功。');
  } else {
    console.error('服装数据模块初始化失败！');
  }

  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });
}

startServer();