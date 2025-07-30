// @see: https://stylelint.io

export default {
  root: true,

  /* 继承某些已有的规则 */
  extends: [
    'stylelint-config-standard', // 配置stylelint拓展插件
    'stylelint-prettier/recommended', // 在 Stylelint 中集成 Prettier，使其成为 Stylelint 规则的一部分
    'stylelint-config-recess-order', // 配置stylelint css属性书写顺序插件,
  ],

  plugins: ['stylelint-less', 'stylelint-prettier'], // 配置stylelint less拓展插件

  /* 自定义规则 */
  rules: {
    // 允许 tailwind 的 at-rule
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
    // 允许驼峰命名的 keyframes
    'keyframes-name-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: 'Expected keyframe name to be kebab-case or camelCase',
      },
    ],
    // 允许驼峰命名的 CSS 变量
    'custom-property-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: 'Expected custom property name to be kebab-case or camelCase',
      },
    ],
    // 禁用重复选择器检查
    'no-duplicate-selectors': null,
    // 禁用特异性顺序检查
    'no-descending-specificity': null,
  },
  // overrides: [
  //   // 若项目中存在less文件，添加以下配置
  //   {
  //     files: ['*.less', '**/*.less'],
  //     customSyntax: 'postcss-less',
  //   },
  // ],
};
