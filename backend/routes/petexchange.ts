import { Request, Response, Router } from 'express';
import {
  batchQueryUserPets,
  getAllPets,
  getAllUsersFromDatabase,
  getPetById,
} from '../dataparse/petexchange';

// 用户查询结果接口
interface UserQueryResult {
  userid: string;
  userName?: string;
  success: boolean;
  petIds?: string[];
  petInfos?: any[];
  rawData?: any;
  error?: string;
  apiResponse?: any;
}

const router = Router();

/**
 * @route POST /extract-petid
 * @description 批量查询用户ID的宠物信息
 * @param {string[]} userIdList - 用户ID列表
 * @returns {object} 200 - 包含查询结果的JSON对象
 */
router.post('/extract-petid', async (req: Request, res: Response) => {
  const { userIdList } = req.body;

  if (!userIdList || !Array.isArray(userIdList) || userIdList.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'userIdList is required and must be a non-empty array',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const results = (await batchQueryUserPets(userIdList)) as UserQueryResult[];

    // 统计结果
    const successCount = results.filter((r: UserQueryResult) => r.success).length;
    const failCount = results.filter((r: UserQueryResult) => !r.success).length;

    res.json({
      success: true,
      total: userIdList.length,
      successCount: successCount,
      failed: failCount,
      results: results,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to process batch request.',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /pets
 * @description 获取所有宠物
 * @returns {object} 200 - 包含所有宠物的数组
 */
router.get('/pets', (req: Request, res: Response) => {
  const pets = getAllPets();
  res.json({
    success: true,
    data: pets,
    count: pets.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /pet/:id
 * @description 根据ID获取单个宠物
 * @param {string} id - 宠物ID
 * @returns {object} 200 - 宠物对象
 * @returns {object} 404 - 如果未找到宠物
 */
router.get('/pet/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const pet = getPetById(id);

  if (pet) {
    res.json({
      success: true,
      data: pet,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      success: false,
      error: `未找到ID为 ${id} 的宠物`,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @route GET /users-from-database
 * @description 获取数据库中所有用户的数据
 * @returns {object} 200 - 包含所有用户数据的JSON对象
 */
router.get('/users-from-database', async (req: Request, res: Response) => {
  try {
    const usersData = await getAllUsersFromDatabase();

    res.json({
      success: true,
      total: usersData.length,
      data: usersData,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users from database.',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
