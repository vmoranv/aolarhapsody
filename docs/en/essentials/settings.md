# Configuration

## Environment Variables Configuration

The project's environment variable configuration is located in the application directory under `.env`, `.env.development`, and `.env.production`.

The rules are consistent with [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html). The format is as follows:

```bash
.env                # Loaded in all environments
.env.local          # Loaded in all environments, but ignored by git
.env.[mode]         # Loaded only in the specified mode
.env.[mode].local   # Loaded only in the specified mode, but ignored by git
```

## Environment Configuration Description

::: code-group

```bash [Development Environment (.env.development)]
# Frontend port
VITE_PORT=3000

# Backend API base URL
VITE_API_BASE_URL=http://localhost:3001

# Application title
VITE_APP_TITLE=Aolarhapsody Dev
```

```bash [Production Environment (.env.production)]
# Frontend port
VITE_PORT=80

# Backend API base URL
VITE_API_BASE_URL=/api

# Application title
VITE_APP_TITLE=Aolarhapsody
```

:::

## Configuration Files

### Frontend Configuration

Frontend configuration files include:

- `vite.config.ts`: Vite build configuration
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `.eslintrc.cjs`: ESLint configuration
- `.stylelintrc.cjs`: Stylelint configuration

### Backend Configuration

Backend configuration files include:

- `tsconfig.json`: TypeScript configuration
- `.eslintrc.cjs`: ESLint configuration

## Custom Configuration

### Adding New Environment Variables

To add new environment variables:

1. Add the variable to the appropriate `.env` file
2. Prefix with `VITE_` if it needs to be accessible in the frontend
3. Restart the development server

### Configuration Validation

The project includes configuration validation to ensure required variables are present:

```ts
// frontend/src/utils/config.ts
const validateConfig = () => {
  if (!import.meta.env.VITE_API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required');
  }
};
```

## Dynamic Configuration

### Dynamic Configuration in Production

In production environments, the application supports dynamic configuration through environment variables. This allows for runtime configuration changes without requiring a full rebuild of the application.

The dynamic configuration is loaded from the `_app.config.js` file which is generated during the build process. This file contains all environment variables prefixed with `VITE_GLOB_`.

```js
// _app.config.js (generated file example)
window.\_APP_CONFIG_ = {
VITE_GLOB_API_BASE_URL: '/api',
VITE_GLOB_APP_TITLE: 'Aolarhapsody'
};

```

These dynamic configuration values can be accessed throughout the application:

### Dynamic Configuration Best Practices

1. **Separation of Static and Dynamic Config**: Use `VITE_` prefix for static config that doesn't change between deployments, and `VITE_GLOB_` for dynamic config that may change in production.
2. **Fallback Values**: Always provide fallback values for dynamic configuration:

   ```ts
   const apiBaseUrl = window._APP_CONFIG_.VITE_GLOB_API_BASE_URL || process.env.VITE_API_BASE_URL;
   ```

3. **Configuration Validation**: Validate dynamic configuration values at application startup:

   ```ts
   const validateDynamicConfig = () => {
     if (!window._APP_CONFIG_.VITE_GLOB_API_BASE_URL) {
       throw new Error('VITE_GLOB_API_BASE_URL is required in production');
     }
   };
   ```

4. **Secure Configuration**: Never expose sensitive information through dynamic configuration
5. **Environment-Specific Configuration**: Use different dynamic configuration values for different deployment environments

### Dynamic Configuration Generation

After executing `pnpm build` in the project root directory, a `dist/_app.config.js` file will be automatically generated in the corresponding application and inserted into `index.html`.

`_app.config.js` is a dynamic configuration file that can dynamically modify configurations according to different environments after the project is built. The content is as follows:

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

### Purpose

`_app.config.js` is used for requirements that need to dynamically modify configurations after packaging, such as API addresses. Without re-packaging, you can modify the variables in `/dist/_app.config.js` after packaging, and refresh to update the local variables in the code. The use of `js` files here is to ensure that the configuration file loading order remains at the front.

### Adding New Dynamic Configuration

To add a new dynamically configurable item, just follow these steps:

- First, add the variable that needs to be dynamically configured in the `.env` file or the corresponding development environment configuration file. The variable needs to start with `VITE_GLOB_*`, such as:

  ```bash
  VITE_GLOB_OTHER_API_URL=https://api.example.com/other-api
  ```

- Use the variable in the frontend code:

  ```ts
  const otherApiURL = import.meta.env.VITE_GLOB_OTHER_API_URL;
  ```

At this point, the configuration item can be used within the project.

::: warning Note

In production environments, these configuration items can be dynamically changed by modifying the `dist/_app.config.js` file without rebuilding the entire project.

:::

## Security Considerations

::: warning Security Warning

- Never commit sensitive information (such as API keys, passwords) to version control
- Use environment variables for sensitive configuration
- Use `.env.local` for local development configuration (it's git-ignored by default)

:::

## Best Practices

1. **Environment Separation**: Maintain separate configuration files for different environments
2. **Documentation**: Document all configuration variables
3. **Validation**: Validate configuration at application startup
4. **Security**: Never expose sensitive information in client-side code
5. **Consistency**: Maintain consistent naming conventions for configuration variables

By following these configuration guidelines, you can ensure that your Aolarhapsody deployment is properly configured for your environment.
