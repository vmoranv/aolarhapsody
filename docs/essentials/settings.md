# 配置

## 环境变量配置

项目的环境变量配置位于应用目录下的 `.env`、`.env.development`、`.env.production`.

规则与 [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html) 一致.格式如下：

```bash
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入,但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入,但会被 git 忽略
```

## 环境配置说明

::: code-group

```bash [.env]
# 应用标题
VITE_APP_TITLE=Aolarhapsody
```

```bash [.env.development]
# 端口号
VITE_PORT=5173

# 资源公共路径,需要以 / 开头和结尾
VITE_BASE=/

# 接口地址
VITE_GLOB_API_URL=http://localhost:3000

# 是否注入全局loading
VITE_INJECT_APP_LOADING=true

```

```bash [.env.production]
# 资源公共路径,需要以 / 开头和结尾
VITE_BASE=/

# 接口地址
VITE_GLOB_API_URL=

# 是否开启压缩,可以设置为 none, brotli, gzip
VITE_COMPRESS=gzip

# 是否注入全局loading
VITE_INJECT_APP_LOADING=true

# 打包后是否生成dist.zip
VITE_ARCHIVER=true

```

:::

## 生产环境动态配置

当在项目根目录下,执行 `pnpm build`构建项目之后,会自动在对应的应用下生成 `dist/_app.config.js`文件并插入 `index.html`.

`_app.config.js` 是一个动态配置文件,可以在项目构建之后,根据不同的环境动态修改配置.内容如下：

```ts
window._VBEN_ADMIN_PRO_APP_CONF_ = {
  VITE_GLOB_API_URL: '',
};
Object.freeze(window._VBEN_ADMIN_PRO_APP_CONF_);
Object.defineProperty(window, '_VBEN_ADMIN_PRO_APP_CONF_', {
  configurable: false,
  writable: false,
});
```

### 作用

`_app.config.js` 用于项目在打包后,需要动态修改配置的需求,如接口地址.不用重新进行打包,可在打包后修改 /`dist/_app.config.js` 内的变量,刷新即可更新代码内的局部变量.这里使用`js`文件,是为了确保配置文件加载顺序保持在前面.

### 新增

新增一个可动态修改的配置项,只需要按照如下步骤即可：

- 首先在 `.env` 或者对应的开发环境配置文件内,新增需要可动态配置的变量,需要以 `VITE_GLOB_*` 开头的变量,如：

  ```bash
  VITE_GLOB_OTHER_API_URL=https://api.example.com/other-api
  ```

- 在前端代码中使用该变量：

  ```ts
  const otherApiURL = import.meta.env.VITE_GLOB_OTHER_API_URL;
  ```

到这里,就可以在项目内使用该配置项了.

::: warning 注意

在生产环境中,可以通过修改 `dist/_app.config.js` 文件来动态更改这些配置项,而无需重新构建整个项目.

:::
