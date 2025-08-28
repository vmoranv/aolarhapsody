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

::: tip

- Only variables starting with `VITE_` will be embedded into the client-side package. You can access them in project code like this:

  ```ts
  console.log(import.meta.env.VITE_PORT);
  ```

- Variables starting with `VITE_GLOB_*` will be added to the `_app.config.js` configuration file during packaging.

:::

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

## Security Considerations

::: warning Security Warning

- Never commit sensitive information (such as API keys, passwords) to version control
- Use environment variables for sensitive configuration
- Use `.env.local` for local development configuration (it's git-ignored by default)

:::

## Best Practices

1. **Environment Separation**: Use different configuration files for different environments
2. **Documentation**: Document all configuration variables
3. **Validation**: Validate configuration at application startup
4. **Security**: Never expose sensitive information in client-side code
5. **Consistency**: Maintain consistent naming conventions for configuration variables

By following these configuration guidelines, you can ensure that your Aolarhapsody deployment is properly configured for your environment.
