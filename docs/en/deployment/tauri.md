# Tauri Desktop Application Building

This project supports building desktop applications using Tauri, which can build applications for multiple platforms (Windows, macOS, Linux).

## Build Preparation

Before building a Tauri app, you need to install the Tauri CLI dependencies:

```bash
pnpm install
```

Make sure you have installed the system dependencies for Tauri, please refer to the [Tauri official documentation](https://tauri.app/v1/guides/getting-started/prerequisites/) for details.

## Build Commands

The project provides a dedicated build script for building Tauri desktop applications:

```bash
pnpm build:tauri
```

This command will perform the following operations:

1. Use `pnpm --filter frontend exec tauri build` command to build the Tauri app
2. Automatically build the application for the corresponding platform based on the current operating system

You can also build directly using the Tauri CLI:

```bash
cd frontend
pnpm tauri build
```

## Multi-platform Building

### Windows

On Windows systems, the build command will automatically create `.msi` and `.exe` installers.

### macOS

On macOS systems, the build command will automatically create `.app` application packages and `.dmg` installation images.

### Linux

On Linux systems, the build command will automatically create `.AppImage` and `.deb` installers.

## Custom Build Configuration

Tauri's build configuration is located in the `frontend/src-tauri/tauri.conf.json` file, you can modify the following configurations as needed:

1. Application identifier (identifier)
2. Application version (version)
3. Application name (productName)
4. Window configuration (window size, title, etc.)
5. Packaging options (bundle)

## Notes

1. The first build may take a long time because it needs to download and compile Rust dependencies
2. Network connection is required during the build process to download dependencies
3. Some platforms may require specific build environments or dependencies
4. Build artifacts will be located in the `frontend/src-tauri/target/release/bundle/` directory
