import express, { Request, Response } from 'express';
import { getRandomNameConfig } from '../dataparse/randomname';
import { NameCombination } from '../types/randomname';

const router = express.Router();

let randomTimes = 0;

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

router.get('/randomname', async (req: Request, res: Response) => {
  try {
    const { nameCombination1, nameCombination2 } = await getRandomNameConfig();
    let combination: NameCombination;

    if (randomTimes % 2 === 0) {
      // 奇数次，从 nameCombination1 中随机选择（这里我们随机选择性别）
      combination = getRandomElement(nameCombination1);
    } else {
      // 偶数次，从 nameCombination2 中随机选择
      combination = getRandomElement(nameCombination2);
    }
    randomTimes++;

    const name =
      getRandomElement(combination['1']) +
      getRandomElement(combination['2']) +
      getRandomElement(combination['3']) +
      getRandomElement(combination['4']);

    res.json({ name });
  } catch (err) {
    console.error('生成随机名称时出错:', err);
    res.status(500).json({ error: '生成随机名称时出错' });
  }
});

export default router;
