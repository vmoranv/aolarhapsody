# Project Architecture

::: info This document introduces the Aolarhapsody project architecture design

- Monorepo architecture based on pnpm workspaces
- Frontend-backend separation design pattern
- Containerized deployment support
  :::

Aolarhapsody is a monorepo project based on [pnpm workspace](https://pnpm.io/workspaces), adopting a modern full-stack technology architecture that implements a frontend-backend separation design pattern.

## Overall Architecture

The project adopts a typical frontend-backend separation architecture, implementing a monorepo management model based on pnpm workspaces. The overall architecture is as follows:

```
┌─────────────────────────────────────────────────────────────┐
│                    Aolarhapsody Monorepo                    │
├─────────────────────────────────────────────────────────────┤
│                      Frontend (React)                       │
├─────────────────────────────────────────────────────────────┤
│                      Backend (Node.js)                      │
├─────────────────────────────────────────────────────────────┤
│                   Data Source (Game Data Files)             │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Technology Stack

- **Core Framework**: [React 18+](https://reactjs.org/)
- **Language**: [TypeScript 5+](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Component Library**: [Ant Design](https://ant.design/)
- **Routing Management**: [React Router v6+](https://reactrouter.com/)
- **Style Processing**: [Tailwind CSS](https://tailwindcss.com/)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)

### Backend Technology Stack

- **Runtime Environment**: [Node.js 20+](https://nodejs.org/)
- **Language**: [TypeScript 5+](https://www.typescriptlang.org/)
- **Web Framework**: [Express 5+](https://expressjs.com/)
- **Data Parsing**: [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)
- **CORS Support**: [cors](https://github.com/expressjs/cors)
- **Environment Configuration**: [dotenv](https://github.com/motdotla/dotenv)

### Development Toolchain

- **Package Manager**: [pnpm 10.13.1+](https://pnpm.io/)
- **Code Checking**: [ESLint](https://eslint.org/), [Stylelint](https://stylelint.io/)
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Spell Checking**: [CSpell](https://cspell.org/)
- **Commit Specification**: [Commitlint](https://commitlint.js.org/)
- **Git Hooks**: [Lefthook](https://github.com/evilmartians/lefthook)
- **Documentation Tool**: [VitePress](https://vitepress.dev/)
- **Internal Tools**: ash, turbo-run

## Module Division

### 1. Frontend Module (frontend/)

The frontend module is the interface that users interact with directly, responsible for data display and user operations.

Main functions include:

- Data visualization display
- User interaction processing
- Theme switching support
- Internationalization support
- Responsive design

### 2. Backend Module (backend/)

The backend module is responsible for data processing and API service provision, serving as the data center of the entire application.

Main functions include:

- Game data parsing
- RESTful API provision
- Data processing and transformation
- Cross-origin support

### 3. Script Tools Module (scripts/)

The script tools module contains various tools needed for project development and deployment.

## Data Flow Design

### Frontend-Backend Interaction

The frontend communicates with the backend through HTTP requests, adopting RESTful API design specifications:

```
┌──────────┐      HTTP      ┌──────────┐
│ Frontend │ ────────────→ │ Backend  │
│ (React)  │ ←──────────── │ (Node.js)│
└──────────┘   JSON Data   └──────────┘
```

### Data Processing Flow

1. Raw game data files (XML format)
2. Backend data parsing module processing
3. Conversion to structured data stored in memory
4. Provision to frontend through RESTful API
5. Frontend receives data and displays it

## Deployment Architecture

### Development Environment

In the development environment, frontend and backend can run independently:

```
┌─────────────────┐    ┌─────────────────┐
│  Frontend Dev   │    │  Backend Dev    │
│    Server       │    │    Server       │
│   (Vite 5173)   │    │  (Express 3000) │
└─────────────────┘    └─────────────────┘
```

### Production Environment

In the production environment, Docker containerized deployment is adopted:

```
┌──────────────────────────────────────────────┐
│              Load Balancer/Reverse Proxy     │
│              (Nginx/Cloudflare)              │
├──────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────────┐  │
│  │  Frontend   │    │      Backend        │  │
│  │   (Static   │    │   (Dockerized)      │  │
│  │    Files)   │    │ vmoranv/aolar-      │  │
│  └─────────────┘    │      backend        │  │
└─────────────────────┴─────────────────────┘
```

## Architecture Advantages

1. **Modular Design**: Frontend-backend separation with clear responsibilities, facilitating independent development and maintenance
2. **Monorepo Management**: Using pnpm workspaces to unifiedly manage dependencies and versions
3. **TypeScript Full Stack**: Both frontend and backend use TypeScript, providing complete type safety
4. **Containerized Deployment**: Supports Docker deployment, facilitating scaling and operations
5. **Development Efficiency**: Integrated rich development toolchain, improving development experience
6. **Internationalization Support**: Built-in multilingual support, facilitating global deployment

## Scalability Considerations

The project architecture design fully considers scalability:

1. **Microservice Preparation**: When business complexity increases, backend modules can be split into independent microservices
2. **Multi-platform Support**: Frontend architecture supports extension to mobile or other platforms
3. **Plugin Design**: Data parsing module adopts plugin design, facilitating addition of new data type support
