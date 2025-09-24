/**
 * @file Express 路由，用于生成随机中文名称。
 * @description 该路由提供一个 API 端点 `/randomname`，每次调用时会根据预设的规则集
 * 从字库中随机组合一个四字名称并返回。
 *
 * @module routes/randomname
 * @requires express
 * @requires ../dataparse/randomname
 * @requires ../types/randomname
 */
import express, { Request, Response } from 'express';
import { getRandomNameConfig } from '../dataparse/randomname';
import { NameCombination } from '../types/randomname';

const router = express.Router();

/**
 * 记录随机名称生成器被调用的次数，用于交替使用不同的名称组合规则。
 * @type {number}
 */
let randomTimes = 0;

/**
 * 从数组中随机选择并返回一个元素。
 * @template T
 * @param {T[]} arr - 要从中选择元素的数组。
 * @returns {T} 数组中的一个随机元素。
 */
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @route GET /randomname
 * @description 生成并返回一个随机的四字中文名称。
 * 该端点会交替使用两种不同的名称组合规则，以增加名称的多样性。
 * @param {Request} req - Express 请求对象。
 * @param {Response} res - Express 响应对象。
 * @returns {Promise<void>}
 */
router.get('/randomname', async (req: Request, res: Response) => {
  try {
    const { nameCombination1, nameCombination2 } = await getRandomNameConfig();
    let combination: NameCombination;

    // 根据调用次数交替使用 nameCombination1 和 nameCombination2
    if (randomTimes % 2 === 0) {
      combination = getRandomElement(nameCombination1);
    } else {
      combination = getRandomElement(nameCombination2);
    }
    randomTimes++;

    // 从选定的组合规则中，为名称的四个位置分别随机选择一个字
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
