import { Request, Response, Router } from 'express';
import { getCachedCheckResult } from '../dataparse/subclass-checker';
import { monitorConfig } from '../types/monitor-config';

const router = Router();

/**
 * @route GET /api/monitor
 * @description 检查所有数据源是否有新的子类。
 * @returns {object} 200 - 成功获取所有数据源的监控状态。
 */
router.get('/monitor', (req: Request, res: Response) => {
  const allSources = Object.keys(monitorConfig);
  const sourcesWithNewSubclasses = allSources
    .map((name) => {
      const source = monitorConfig[name];
      const result = getCachedCheckResult(source.url);
      return {
        name,
        file: source.file,
        newSubclasses: result ? result.newSubclasses : [],
        hasNew: result ? result.hasNew : false,
      };
    })
    .filter((source) => source.hasNew);

  res.json({
    success: true,
    data: {
      hasNewSubclasses: sourcesWithNewSubclasses.length > 0,
      sources: sourcesWithNewSubclasses,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route GET /api/monitor/:name
 * @description 获取特定数据源的详细监控信息。
 * @param {string} name.path.required - 数据源的名称。
 * @returns {object} 200 - 成功获取数据源的详细信息。
 * @returns {object} 404 - 未找到指定名称的数据源或其检查结果。
 */
router.get('/monitor/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const source = monitorConfig[name];

  if (!source) {
    return res.status(404).json({
      success: false,
      error: `未找到名为 ${name} 的监控源。`,
      timestamp: new Date().toISOString(),
    });
  }

  const result = getCachedCheckResult(source.url);

  if (!result) {
    return res.status(404).json({
      success: false,
      error: `尚未生成或缓存 ${name} 的检查结果，请稍后再试。`,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    data: {
      name,
      file: source.file,
      subclassCount: result.subclassCount,
      subclasses: result.allSubclasses,
      hasChange: result.hasNew,
      newSubclasses: result.newSubclasses,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
