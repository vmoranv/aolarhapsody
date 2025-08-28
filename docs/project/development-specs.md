# 开发规范

Aolarhapsody 项目遵循统一的开发规范，确保代码质量和团队协作效率。

## 代码规范

### TypeScript 规范

- 使用 TypeScript 严格模式
- 明确类型定义，避免使用 any
- 合理使用泛型提高代码复用性
- 接口命名使用 PascalCase，接口属性使用 camelCase

### React 规范

- 组件命名使用 PascalCase
- 组件文件名与组件名保持一致
- 优先使用函数组件和 Hooks
- 合理拆分组件，保持组件单一职责

### CSS 规范

- 使用 Tailwind CSS 实用类
- 避免使用内联样式
- 合理使用 CSS Modules 防止样式冲突
- 响应式设计使用断点类

## 项目结构规范

### 文件命名

- 组件文件：PascalCase，如 `UserCard.tsx`
- 工具文件：camelCase，如 `formatDate.ts`
- 配置文件：kebab-case，如 `tailwind.config.js`

### 目录结构

- 按功能划分目录
- 避免过深的嵌套层级
- 相关文件放在同一目录下

## Git 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型

- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

### 分支管理

- main: 主分支，稳定版本
- develop: 开发分支
- feature/\*: 功能分支
- hotfix/\*: 热修复分支

## 测试规范

### 单元测试

- 关键业务逻辑需要单元测试覆盖
- 使用 Jest 作为测试框架
- 测试文件与源文件同目录，命名为 `*.test.ts`

### 端到端测试

- 关键用户流程需要端到端测试
- 使用 Cypress 进行测试

## 文档规范

### 代码注释

- 导出的函数、类、接口需要添加注释
- 复杂逻辑需要添加行内注释
- 使用 TSDoc 格式

### Markdown 文档

- 使用统一的文档模板
- 文档中代码示例保持格式一致
- 文档结构清晰，层次分明

## 性能优化规范

### 前端性能

- 图片资源使用合适的格式和尺寸
- 合理使用代码分割
- 避免不必要的重渲染
- 使用 React.memo 优化组件性能

### 网络性能

- 合理设置 HTTP 缓存
- 减少 HTTP 请求次数
- 使用 CDN 加速静态资源

遵循这些规范有助于提高代码质量，减少维护成本，并提升团队协作效率。
