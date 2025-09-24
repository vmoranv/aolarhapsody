import { defineBuildConfig } from 'unbuild';

/**
 * @description unbuild 配置文件
 */
export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  rollup: {
    emitCJS: false,
  },
  declaration: true,
});
