# Vercel Deployment

This is a Vercel deployment page.

## Deployment Configuration

The project includes deployment configuration in `frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/proxy/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

This configuration proxies requests from the `/proxy` path to the `/api` path for accessing game data APIs. You will need to set the actual backend URL in the `VITE_API_URL` environment variable during deployment.

## Deployment Steps

1. Visit the [Vercel website](https://vercel.com) and log in to your account

2. In the Vercel dashboard, click the "New Project" button

3. Import your project repository:
   - If you've already pushed your code to GitHub/GitLab/Bitbucket, you can choose to import from a Git repository
   - Or upload project files directly

4. Configure the project:
   - The project name will be automatically filled in, you can modify it as needed
   - Make sure the framework preset is selected as "Vite"
   - The build command should be `pnpm build:front` or `tsc -b && vite build`
   - The output directory should be `dist`
   - The root directory should be set to `frontend`

5. Environment variables configuration:
   - Find the "Environment Variables" section in Vercel project settings
   - Add the following environment variables (as needed):
     - `VITE_API_URL` - If you've deployed your own backend service, set it to your backend URL
     - `VITE_COPILOT_PUBLIC_API_KEY` - If you want to enable Copilot Kit features, you need to register at [CopilotKit Cloud](https://cloud.copilotkit.ai) and get an API key
     - `VITE_COPILOT_LICENSE_KEY` - If you have a Copilot Kit license key, you can also add it

6. Click "Deploy" to start deployment

## Build Script Explanation

The project provides several build scripts to meet different needs:

- `pnpm build` - Build the entire project (including frontend and backend)
- `pnpm build:front` - Build frontend application only
- `pnpm build:backend` - Build backend service only
- `pnpm build:docker:backend` - Build backend Docker image

In Vercel deployment, you usually only need to build the frontend application, so the build command should be set to `pnpm build:front`. This command will perform the following operations:

1. Compile frontend code using TypeScript compiler
2. Build production version using Vite
3. Generate optimized static files ready for deployment

## Notes

- The project uses pnpm as the package manager, Vercel will automatically detect and use it
- The project includes two entry files: `index.html` (main application) and `landing.html` (landing page)
- By default, Vercel will deploy the application corresponding to `index.html`
- If you need a custom domain, configure Domains in Vercel project settings
- Copilot Kit features are optional, if related keys are not set, the application can still run normally, but the AI assistant feature will not be available

## Custom Backend Configuration

If you have deployed your own backend service, you need to set the following in Vercel environment variables:

```
VITE_API_URL=https://your-backend-url.com
```

This will make the frontend application connect to your custom backend service.

## Copilot Kit Configuration

The project integrates Copilot Kit to provide AI assistant functionality. To enable this feature, you need to:

1. Visit [CopilotKit Cloud](https://cloud.copilotkit.ai) and register an account
2. Create a new project and get an API key
3. Add the following in Vercel environment variables:
   ```
   VITE_COPILOT_PUBLIC_API_KEY=your_copilot_api_key_here
   ```
4. (Optional) If you have a license key, you can also add:
   ```
   VITE_COPILOT_LICENSE_KEY=your_license_key_here
   ```

If these keys are not set, the AI assistant feature will not work, but it will not affect other functions of the application.
