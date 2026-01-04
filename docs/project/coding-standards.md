# 编码规范

为了保证代码质量和团队协作效率,Aolarhapsody 制定了以下编码规范.

## 代码规范

### TypeScript/JavaScript 规范

1. 使用 TypeScript 进行开发,确保类型安全
2. 遵循 ESLint 规则,保持代码风格一致
3. 使用 Prettier 进行代码格式化
4. 函数和变量命名采用驼峰命名法(camelCase)
5. 类名和组件名采用帕斯卡命名法(PascalCase)
6. 常量使用全大写字母和下划线(UPPER_CASE)
7. 合理使用 import/export,避免循环依赖
8. 优先使用 const,其次是 let,避免使用 var
9. 使用箭头函数时,注意 this 绑定问题

### CSS 规范

1. 使用 Tailwind CSS 进行样式开发
2. 在特殊情况下需要编写自定义 CSS 时,遵循 BEM 命名规范
3. 移动优先的响应式设计
4. CSS 属性按照推荐顺序书写（定位、盒模型、排版、视觉、其他）
5. 避免使用 !important,除非绝对必要
6. 使用 CSS 变量进行主题和复用样式的管理

### React 规范

1. 函数组件优于类组件
2. 合理使用 Hooks
3. 组件拆分要合理,保持组件的单一职责
4. 使用 TypeScript 定义组件 Props 和 State
5. 组件名必须使用 PascalCase
6. Props 接口以 Props 结尾,如 ButtonProps
7. 使用 React.memo 对纯组件进行优化
8. 自定义 Hook 以 use 开头,如 useUserData
9. 避免在 JSX 中写复杂逻辑,提取到函数或变量中

## 工具配置规范

### ESLint 配置

ESLint 是一个代码规范和错误检查工具,用于识别和报告 TypeScript 代码中的语法错误。

#### 常用命令

```bash
# 检查所有文件
pnpm eslint .

# 自动修复可修复的问题
pnpm eslint . --fix
```

#### 配置文件

- ESLint 配置文件：`eslint.config.mjs` 或 `.eslintrc.js`
- 核心配置位于项目内部配置目录
- 推荐使用 `@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin`

#### 解决 Prettier 和 ESLint 的冲突

使用 `eslint-plugin-prettier` 和 `eslint-config-prettier` 解决冲突：

```bash
npm install -D eslint-plugin-prettier eslint-config-prettier
```

在 `.eslintrc.js` 中添加：

```javascript
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:prettier/recommended"  // 添加 prettier 插件
  ],
  "plugins": ["prettier"]
}
```

### Stylelint 配置

Stylelint 用于校验项目内部 CSS 的风格,加上编辑器的自动修复,可以很好地统一项目内部 CSS 风格。

#### 常用命令

```bash
# 检查样式文件
pnpm stylelint "**/*.{vue,css,less,scss}"

# 自动修复
pnpm stylelint "**/*.{vue,css,less,scss}" --fix
```

#### 配置文件

- Stylelint 配置文件：`stylelint.config.mjs` 或 `.stylelintrc.js`
- 推荐配置：`stylelint-config-standard`、`stylelint-config-recess-order`

### Prettier 配置

Prettier 可以用于统一项目代码风格,统一的缩进,单双引号,尾逗号等等风格。

#### 常用命令

```bash
# 格式化所有文件
pnpm prettier .

# 检查格式（不修改文件）
pnpm prettier --check .
```

#### 配置文件

- Prettier 配置文件：`.prettierrc` 或 `.prettier.mjs`
- 推荐配置：使用 2 空格缩进,使用单引号,尾逗号等

### Commitlint 配置

Commitlint 用于检查 git 提交信息的规范。

#### 安装

```bash
npm install -D @commitlint/config-conventional @commitlint/cli
```

#### 配置文件

在项目根目录创建 `commitlint.config.js`：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

### Cspell 配置

Cspell 是一个用于检查拼写错误的工具,可以检查代码中的拼写错误,避免因为拼写错误导致的 bug。

#### 常用命令

```bash
# 检查拼写错误
pnpm cspell lint "**/*.ts" "**/README.md" ".changeset/*.md" --no-progress
```

#### 配置文件

- 配置文件：`cspell.json`
- 可以添加项目特定的词汇表

### Publint 配置

Publint 是一个用于检查 npm 包的规范的工具,可以检查包的版本号是否符合规范,是否符合标准的 ESM 规范包等等。

#### 常用命令

```bash
# 检查包规范
pnpm publint
```

## Git Hook 管理

### Lefthook 配置

Lefthook 用于管理 Git hooks,在提交前自动运行代码校验和格式化。

#### 配置文件

项目在 `lefthook.yml` 内部定义了相应的 hooks：

```yaml
pre-commit:
  parallel: true
  jobs:
    - name: lint-js
      run: pnpm prettier --cache --ignore-unknown --write {staged_files}
      glob: '*.{js,jsx,ts,tsx}'
    - name: lint-style
      run: pnpm stylelint --fix {staged_files}
      glob: '*.{css,less,scss}'
    - name: lint-md
      run: pnpm prettier --write {staged_files}
      glob: '*.md'

commit-msg:
  commands:
    - name: commitlint
      run: pnpm commitlint --edit {1}

post-merge:
  commands:
    - name: install
      run: pnpm install
```

#### 关闭 Lefthook

**临时关闭**：

```bash
git commit -m "feat: add home page" --no-verify
```

**永久关闭**：
删除 `lefthook.yml` 文件即可。

### Husky 替代方案

如果使用 Husky 而非 Lefthook,配置方式类似：

#### 安装和初始化

```bash
# 安装 husky
pnpm add -D husky

# 初始化
pnpm exec husky install

# 添加 pre-commit hook
pnpm exec husky add .husky/pre-commit "pnpm lint-staged"

# 添加 commit-msg hook
pnpm exec husky add .husky/commit-msg "pnpm commitlint --edit \$1"
```

#### Lint-staged 配置

在 `package.json` 中添加：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,less,scss}": ["stylelint --fix", "prettier --write"],
    "*.md": ["prettier --write"]
  }
}
```

## Git 提交规范

### 提交格式

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整(不影响代码运行的变动)
- `refactor`: 重构(既不是新增功能,也不是修改 bug 的代码变动)
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `revert`: 回滚 commit
- `workflow`: 工作流改进
- `ci`: 持续集成
- `types`: 类型修改

### Scope 范围

Scope 用于说明 commit 影响的范围,可以是：

- `frontend`: 前端相关
- `backend`: 后端相关
- `docs`: 文档相关
- `scripts`: 脚本相关
- `config`: 配置相关
- `deps`: 依赖相关
- `ui`: UI 组件相关
- `api`: API 接口相关

### 提交信息示例

```bash
# 新功能
feat(auth): add user login functionality

# 修复 bug
fix(api): resolve user data parsing error

# 文档更新
docs(readme): update installation instructions

# 性能优化
perf(components): optimize image loading with lazy loading

# 重构
refactor(utils): simplify date formatting functions
```

### 关闭提交规范检查

**临时关闭**：

```bash
git commit -m "feat: add home page" --no-verify
```

**永久关闭**：
在 `.husky/commit-msg` 内注释以下代码：

```bash
# pnpm exec commitlint --edit "$1"
```

## 代码审查规范

1. 所有代码必须经过至少一名其他开发者的审查
2. PR 描述需要清晰说明变更内容和目的
3. 遵循团队约定的代码风格
4. 确保测试通过
5. 关注代码的可读性和可维护性

## 测试规范

1. 新功能需要添加相应的单元测试
2. 修复 bug 后需要添加回归测试
3. 测试代码与业务代码保持相同的质量标准
4. 使用 Jest 进行单元测试
5. 使用 React Testing Library 进行组件测试

## 文档规范

1. 新功能需要提供相应的文档说明
2. API 接口需要提供详细的接口文档
3. 重要设计决策需要在文档中说明
4. 文档需要与代码同步更新

## 项目结构规范

1. 遵循既定的目录结构
2. 文件命名清晰且具描述性
3. 组件和模块的拆分要合理
4. 避免循环依赖

## 性能优化规范

1. 图片资源需要压缩
2. 合理使用懒加载
3. 避免不必要的重渲染
4. 合理使用缓存策略
5. 使用 React.memo 和 useMemo 优化组件性能
6. 代码分割和动态导入减少初始加载时间
7. 使用 Web Workers 处理计算密集型任务
8. 优化包体积,移除未使用的依赖

## 工程化最佳实践

### 代码质量保证

1. **自动化检查**：通过 Git Hooks 确保提交前代码质量
2. **持续集成**：在 CI/CD 流程中集成代码检查
3. **代码覆盖率**：保持合理的测试覆盖率
4. **性能监控**：定期进行性能测试和监控

### 团队协作

1. **代码审查**：所有代码必须经过至少一名其他开发者的审查
2. **文档同步**：代码变更时同步更新相关文档
3. **知识分享**：定期进行技术分享和最佳实践交流
4. **工具统一**：团队成员使用统一的开发工具和配置

### 项目维护

1. **依赖管理**：定期更新依赖,修复安全漏洞
2. **代码重构**：定期进行技术债务清理
3. **版本管理**：遵循语义化版本控制规范
4. **备份策略**：确保代码和数据的安全备份

## 开发环境配置

### 必需的 VSCode 插件

为保证开发效率和代码质量,推荐安装以下 VSCode 插件：

1. **ESLint** - 脚本代码检查
2. **Prettier** - 代码格式化
3. **Stylelint** - CSS 格式化
4. **TypeScript Importer** - 自动导入 TypeScript 模块
5. **Auto Rename Tag** - 自动重命名配对的 HTML/XML 标签
6. **Bracket Pair Colorizer** - 括号对着色
7. **GitLens** - 增强 Git 功能
8. **Code Spell Checker** - 单词语法检查

### 项目初始化检查清单

新项目或新环境配置时,请检查以下项目：

1. [ ] 安装所有必需依赖
2. [ ] 配置 ESLint 和 Prettier
3. [ ] 设置 Git Hooks（Lefthook/Husky）
4. [ ] 配置 Commitlint
5. [ ] 安装 VSCode 插件
6. [ ] 配置工作区设置
7. [ ] 运行测试确保环境正常
8. [ ] 检查代码格式化是否正常工作

## 故障排除

### 常见问题

1. **ESLint 和 Prettier 冲突**
   - 确保安装了 `eslint-config-prettier`
   - 检查配置文件的加载顺序

2. **Git Hooks 不生效**
   - 检查是否有执行权限
   - 确认 Git 版本兼容性
   - 重新初始化 Git Hooks

3. **Commitlint 验证失败**
   - 检查提交信息格式是否符合规范
   - 确认配置文件路径正确

4. **Stylelint 报错**
   - 检查 CSS 语法是否正确
   - 确认配置文件中的语法解析器设置

## 总结

遵循这些规范有助于提高代码质量、团队协作效率和项目的可维护性。规范的制定和执行是一个持续改进的过程,团队应该根据项目实际情况和成员反馈,定期审视和更新这些规范。

记住：**规范是为了提高效率,而不是束缚创造力**。在特殊情况下,可以根据实际需求灵活调整,但需要团队共识和文档记录。
