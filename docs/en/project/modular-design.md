# Modular Design

Aolarhapsody adopts modular design principles, dividing functions into independent modules, each with clear responsibilities and interfaces, making it easy to maintain and extend.

## Design Principles

### High Cohesion and Low Coupling

Each module is highly cohesive internally, focusing on completing specific functions, while maintaining low coupling between modules to reduce interdependencies.

### Single Responsibility Principle

Each module is responsible for only one functional area, ensuring clear and well-defined module responsibilities.

### Open/Closed Principle

Modules are open for extension but closed for modification, adding new features through extension rather than modification.

## Module Division

### 1. Frontend Module (frontend/)

The frontend module is the user-facing interface responsible for data display and user interactions.

Main functions include:

- Data visualization display
- User interaction handling
- Theme switching support
- Internationalization support
- Responsive design

Directory structure:

```
frontend/
├── src/
│   ├── components/     # Public components
│   ├── views/          # Page views
│   ├── hooks/          # Custom Hooks
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   ├── router/         # Routing configuration
│   ├── theme/          # Theme configuration
│   └── locales/        # Internationalization resources
├── public/             # Static resources
└── package.json        # Frontend dependencies configuration
```

### 2. Backend Module (backend/)

The backend module is responsible for data processing and API services, serving as the data hub of the entire application.

Main functions include:

- Game data parsing
- RESTful API provision
- Data processing and transformation
- Cross-origin support

Directory structure:

```
backend/
├── dataparse/          # Data parsing module
├── routes/             # API routes
├── types/              # TypeScript type definitions
├── index.ts            # Application entry
├── Dockerfile          # Docker configuration
└── package.json        # Backend dependencies configuration
```

### 3. Script Tools Module (scripts/)

The script tools module contains various tools needed for project development and deployment.

Directory structure:

```
scripts/
├── ash/                # Auxiliary script tools
├── turbo-run/          # Interactive script runner
├── deploy/             # Deployment-related scripts
└── clean.mjs           # Cleanup script
```

## Inter-Module Communication

### Frontend-Backend Interaction

The frontend communicates with the backend through HTTP requests, following RESTful API design principles:

```
┌──────────┐      HTTP      ┌──────────┐
│ Frontend │ ────────────→ │ Backend  │
│ (React)  │ ←──────────── │ (Node.js)│
└──────────┘   JSON Data   └──────────┘
```

### Data Processing Flow

1. Raw game data files (XML format)
2. Backend data parsing module processes the data
3. Convert to structured data stored in memory
4. Provide to frontend through RESTful API
5. Frontend receives data and displays it

## Module Extensibility

### Plugin-based Design

The data parsing module adopts a plugin-based design, making it easy to add support for new data types:

```typescript
// Example: Adding a new data parser
// backend/dataparse/newdata.ts
export const parseNewData = (data: string): ParsedData => {
  // Parsing logic
  return parsedData;
};
```

### Microservices Ready

When business complexity increases, backend modules can be split into independent microservices:

```
┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Load Balancer  │
├─────────────────┤    ├─────────────────┤
│  User Service   │    │  Data Service   │
│                 │    │                 │
│  Auth Service   │    │  Cache Service  │
└─────────────────┘    └─────────────────┘
```
