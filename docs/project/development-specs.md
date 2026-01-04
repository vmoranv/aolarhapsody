# 开发规范

Aolarhapsody 项目遵循统一的开发规范,确保代码质量和团队协作效率.

## 环境准备

### 环境要求

- **Node.js**: 推荐使用 Node.js 20+ 版本
- **包管理器**: 使用 pnpm 作为包管理工具
- **IDE**: 推荐使用 VS Code,并安装相关插件

### 必需的 VSCode 插件

为确保开发效率,推荐安装以下插件：

1. **ESLint** - 代码检查
2. **Prettier** - 代码格式化
3. **Stylelint** - CSS 样式检查
4. **TypeScript Importer** - 自动导入模块
5. **Auto Rename Tag** - 自动重命名标签
6. **GitLens** - 增强 Git 功能

### 项目初始化

```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 开发流程

### 分支管理策略

- **main**: 主分支,稳定版本
- **develop**: 开发分支,集成最新功能
- **feature/\***: 功能分支,开发新功能
- **hotfix/\***: 热修复分支,紧急修复

### 开发环境配置

#### 环境变量

项目支持多环境配置：

- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env.test` - 测试环境

#### 环境变量示例

```bash
# 开发环境
VITE_API_BASE_URL=http://localhost:3000
VITE_DEVTOOLS=true
```

### 开发服务器

#### 启动开发环境

```bash
# 启动前端开发服务器
pnpm dev

# 启动后端开发服务器
pnpm dev:backend

# 同时启动前后端
pnpm dev:all
```

#### 开发工具配置

项目内置了开发工具支持：

- **Vue DevTools**: 在开发环境中可启用
- **热重载**: 代码修改后自动刷新
- **错误提示**: 详细的错误信息和堆栈跟踪

## 代码规范

### TypeScript 规范

- 使用 TypeScript 严格模式
- 明确类型定义,避免使用 any
- 合理使用泛型提高代码复用性
- 接口命名使用 PascalCase,接口属性使用 camelCase
- 优先使用 interface 而不是 type（除非特殊情况）

### React 规范

- 组件命名使用 PascalCase
- 组件文件名与组件名保持一致
- 优先使用函数组件和 Hooks
- 合理拆分组件,保持组件单一职责
- 使用 TypeScript 定义组件 Props 和 State
- 自定义 Hook 以 use 开头

### CSS 规范

- 使用 Tailwind CSS 实用类
- 避免使用内联样式
- 合理使用 CSS Modules 防止样式冲突
- 响应式设计使用断点类
- CSS 属性按照推荐顺序书写（定位、盒模型、排版、视觉、其他）

### 代码格式化

项目使用统一的代码格式化工具：

- **ESLint**: 代码检查和错误修复
- **Prettier**: 代码格式化
- **Stylelint**: CSS 样式检查

## 项目结构规范

### 目录结构

```
aolarhapsody/
├── frontend/           # 前端应用
│   ├── src/
│   │   ├── components/  # 公共组件
│   │   ├── views/       # 页面组件
│   │   ├── hooks/       # 自定义 Hooks
│   │   ├── utils/       # 工具函数
│   │   └── types/       # 类型定义
│   └── public/          # 静态资源
├── backend/            # 后端服务
│   ├── routes/         # API 路由
│   ├── types/          # 类型定义
│   └── dataparse/      # 数据解析
├── docs/               # 项目文档
└── scripts/            # 构建脚本
```

### 文件命名规范

- **组件文件**: PascalCase,如 `UserCard.tsx`
- **工具文件**: camelCase,如 `formatDate.ts`
- **配置文件**: kebab-case,如 `tailwind.config.js`
- **常量文件**: UPPER_CASE,如 `API_CONSTANTS.ts`

### 导入导出规范

```typescript
// 推荐的导入顺序
// 1. Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 2. 第三方库
import React from 'react';
import axios from 'axios';

// 3. 项目内部模块
import { UserCard } from '@/components/UserCard';
import { formatDate } from '@/utils/date';

// 4. 相对路径导入
import './styles.css';
```

## Git 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响代码运行的变动）
- **refactor**: 重构（既不是新增功能,也不是修改 bug 的代码变动）
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **revert**: 回滚 commit
- **workflow**: 工作流改进
- **ci**: 持续集成

### 提交示例

```bash
feat(auth): add user login functionality
fix(api): resolve data parsing error
docs(readme): update installation instructions
perf(components): optimize image loading
```

### Git Hooks

项目使用 Git Hooks 确保代码质量：

- **pre-commit**: 提交前运行代码检查和格式化
- **commit-msg**: 检查提交信息格式
- **post-merge**: 合并后自动安装依赖

## 测试规范

### 单元测试

- 关键业务逻辑需要单元测试覆盖
- 使用 Jest 作为测试框架
- 测试文件与源文件同目录,命名为 `*.test.ts`
- 测试覆盖率应保持在 80% 以上

### 测试示例

```typescript
// utils/date.test.ts
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('2023-01-01');
  });
});
```

### 端到端测试

- 关键用户流程需要端到端测试
- 使用 Cypress 进行测试
- 测试文件放在 `tests/e2e/` 目录下

## 构建和部署

### 构建命令

```bash
# 开发环境构建
pnpm build:dev

# 生产环境构建
pnpm build

# 构建文档
pnpm build:docs
```

### 构建配置

项目使用 Turbo 进行构建优化：

- **并行构建**: 多个包并行构建
- **增量构建**: 只构建变更的部分
- **缓存机制**: 复用构建结果

### 静态资源

公共静态资源放在 `public/static` 目录下：

```bash
public/
├── static/
│   ├── images/
│   ├── icons/
│   └── fonts/
```

引用路径：`/static/xxx.png`

## 文档规范

### 代码注释

- 导出的函数、类、接口需要添加注释
- 复杂逻辑需要添加行内注释
- 使用 TSDoc 格式

```typescript
/**
 * 格式化日期
 * @param date - 要格式化的日期
 * @param format - 格式化模式
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
  // 实现逻辑
}
```

### Markdown 文档

- 使用统一的文档模板
- 文档中代码示例保持格式一致
- 文档结构清晰,层次分明
- 使用相对路径引用其他文档

## 性能优化规范

### 前端性能

- 图片资源使用合适的格式和尺寸
- 合理使用代码分割
- 避免不必要的重渲染
- 使用 React.memo 优化组件性能
- 使用懒加载减少初始加载时间

### 网络性能

- 合理设置 HTTP 缓存
- 减少 HTTP 请求次数
- 使用 CDN 加速静态资源
- 启用 Gzip 压缩

### 代码优化

- 使用 Tree Shaking 移除未使用代码
- 优化包体积,移除不必要的依赖
- 使用 Web Workers 处理计算密集型任务

## 故障排除

### 常见问题

1. **依赖安装失败**

   ```bash
   # 清理缓存重新安装
   pnpm reinstall
   ```

2. **开发服务器启动失败**
   - 检查端口是否被占用
   - 确认环境变量配置正确
   - 查看错误日志定位问题

3. **构建失败**
   - 检查 TypeScript 类型错误
   - 确认所有依赖都已安装
   - 查看构建日志获取详细信息

### 开发工具

项目提供了丰富的开发工具：

- **代码检查**: ESLint、Stylelint
- **格式化**: Prettier
- **测试**: Jest、Cypress
- **构建**: Turbo、Vite
- **文档**: VitePress

遵循这些规范有助于提高代码质量,减少维护成本,并提升团队协作效率。
