import express, { Express, Request, Response } from 'express';
import { fetchAndProcessAllAttributes, fetchAttributeRelations } from './skill-parser';
import cors from 'cors';

const app: Express = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/skill-attributes', async (req: Request, res: Response) => {
  const data = await fetchAndProcessAllAttributes();
  res.json(data);
});

app.get('/api/attribute-relations/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const relationsResponse = await fetchAttributeRelations();

  if (!relationsResponse.success || !relationsResponse.data) {
    return res.status(500).json(relationsResponse);
  }

  let relationsData = relationsResponse.data[id];
  if (!relationsData) {
    return res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的克制关系`,
      timestamp: new Date().toISOString(),
    });
  }

  // 特殊处理ID为1的情况，移除最后的7个描述性元素
  if (id === '1') {
    relationsData = relationsData.slice(0, -7);
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

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});