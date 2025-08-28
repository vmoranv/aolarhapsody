# Directory Structure

The directory uses Monorepo management, and the project structure is as follows:

```bash
.
├── backend/                    # Backend service
│   ├── dataparse/              # Data parsing module
│   ├── routes/                 # API routes
│   ├── types/                  # TypeScript type definitions
│   ├── scripts/                # Backend build scripts
│   └── ...
├── frontend/                   # Frontend application
│   ├── public/                 # Static resource files
│   ├── src/                    # Frontend source code
│   │   ├── components/         # Public components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── locales/            # Internationalization resources
│   │   ├── router/             # Routing configuration
│   │   ├── store/              # State management
│   │   ├── theme/              # Theme configuration
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   ├── views/              # Page components
│   │   └── ...
│   ├── src-tauri/              # Tauri desktop application configuration
│   └── ...
├── scripts/                    # Internal CLI tools and scripts
│   ├── ash/                    # Auxiliary script collection (ash)
│   ├── turbo-run/              # Interactive script runner (ar-turbo)
│   ├── deploy/                 # Deployment related scripts and configuration
│   └── ...
├── docs/                       # Project documentation
└── .github/                    # GitHub related configuration
└── ...
```

## 1. Backend Module (backend/)

The backend module is responsible for data processing and API services, serving as the data hub of the entire application.

Main functions include:

- Game data parsing
- RESTful API provision
- Data processing and transformation
- Cross-origin support

Subdirectories:

- **dataparse/**: Contains parsers for various game data, with each file responsible for parsing specific data types
- **routes/**: Defines RESTful API routes to provide data parsing results through HTTP interfaces
- **types/**: TypeScript type definitions to ensure consistency in front-end and back-end data interaction
- **scripts/**: Backend build and development related scripts

## 2. Frontend Module (frontend/)

The frontend module is the user-facing interface responsible for data display and user interactions.

Main functions include:

- Data visualization display
- User interaction handling
- Theme switching support
- Internationalization support
- Responsive design

Subdirectories:

- **public/**: Stores static resource files such as icons and images
- **src/**: Frontend source code directory
  - **components/**: Public components that are reusable UI elements
  - **contexts/**: React contexts for global state management
  - **hooks/**: Custom hooks that encapsulate reusable logic
  - **locales/**: Internationalization resources containing translation files for various languages
  - **router/**: Routing configuration defining the application's routing structure
  - **store/**: State management using Zustand for application state
  - **theme/**: Theme configuration including colors, styles and other theme-related settings
  - **types/**: TypeScript type definitions to ensure type safety
  - **utils/**: Utility functions containing various general-purpose helper methods
  - **views/**: Page components that constitute the main content of application pages
- **src-tauri/**: Tauri desktop application configuration for building desktop versions
  - **capabilities/**: Tauri application permission configurations
  - **icons/**: Application icon resources, including icons of various sizes and platforms
  - **src/**: Rust source code directory
    - **main.rs**: Tauri application entry file
    - **lib.rs**: Tauri application library file containing the main application logic
  - **tauri.conf.json**: Tauri application configuration file defining application basic information, window settings, packaging configuration, etc.
  - **Cargo.toml**: Rust project configuration file defining project dependencies and metadata
  - **build.rs**: Rust build script

## 3. Script Tools Module (scripts/)

The script tools module contains various tools needed for project development and deployment.

- **ash/**: Auxiliary script collection providing various convenient commands
- **turbo-run/**: Interactive script runner to simplify command execution
- **deploy/**: Deployment related scripts and configuration files

## 4. Other Important Files and Directories

- **docs/**: Project documentation including usage instructions and development guides
- **.github/**: GitHub Actions and other GitHub related configurations
- **.vscode/**: VSCode editor configuration including recommended plugins and debug configurations
- **pnpm-workspace.yaml**: pnpm workspace configuration file defining the packages in the project
- **turbo.json**: TurboRepo build tool configuration file for optimizing the build process

The script tools module contains various tools needed for project development and deployment.
