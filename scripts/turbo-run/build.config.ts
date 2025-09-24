import { defineBuildConfig } from 'unbuild';

/**
 * @description unbuild 配置文件
 */
export default defineBuildConfig({
  clean: true,
  declaration: true,
  entries: ['src/index'],
  rollup: {
    emitCJS: false,
  },
});
