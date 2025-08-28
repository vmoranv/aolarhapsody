# Frequently Asked Questions (FAQ)

## Development Related Questions

### How to start the development environment?

Make sure Node.js (v20+) and pnpm (v10.13.1+) are installed, then run:

```bash
pnpm install
pnpm dev
```

### How to build the project?

```bash
# Build the entire project
pnpm build

# Build frontend only
pnpm build:front

# Build backend only
pnpm build:backend
```

### How to run tests?

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run end-to-end tests
pnpm test:e2e
```

## Deployment Related Questions

### How to deploy to Vercel?

1. Push the project to GitHub
2. Import the project on Vercel
3. Set environment variables
4. Deployment complete

### How to deploy backend with Docker?

```bash
# Build Docker image
pnpm build:docker:backend

# Run container
docker run -d -p 3000:3000 --name aolarhapsody-backend aolarhapsody-backend
```

### How to configure environment variables?

Create a `.env` file in the project root:

```properties
VITE_COPILOT_PUBLIC_API_KEY=your_api_key
VITE_COPILOT_LICENSE_KEY=your_license_key
```

## Technical Questions

### Why is the data not updating?

1. Check network connection
2. Clear browser cache
3. Check if backend service is running properly
4. Check console error messages

### How to add a new data parsing module?

1. Create a parsing module in the `backend/dataparse` directory
2. Create corresponding routes in the `backend/routes` directory
3. Create data display pages in the frontend
4. Update related type definitions

### How to customize themes?

1. Modify theme configuration in the `frontend/src/theme` directory
2. Update Tailwind CSS configuration file
3. Restart the development server to see the effects

## Contribution Related

### How to contribute code?

1. Fork the project repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Submit a Pull Request

### How to report bugs?

1. Search GitHub Issues to see if the same issue already exists
2. If not, create a new Issue
3. Describe the issue and reproduction steps in detail
4. Provide relevant environment information

## License Questions

### What license does the project use?

This project uses the GNU Affero General Public License v3.0. See the LICENSE file for details.

### Can it be used in commercial projects?

Yes, the GNU Affero General Public License v3.0 is a free software license that allows using, modifying, and distributing the code in commercial projects, but you must comply with the terms of AGPLv3. Please see the LICENSE file for specific requirements.

For other questions, please ask in GitHub Issues or contact us through the project's provided contact methods.
