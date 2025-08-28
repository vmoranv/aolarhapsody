# CLI Tools

Aolarhapsody provides multiple built-in CLI tools to improve development efficiency and simplify common tasks.

## ash (Assistant Script Helper)

`ash` is a collection of assistant scripts that provide various convenient commands.

### Installation

```bash
pnpm install -g @aolarhapsody/ash
```

Or use directly:

```bash
pnpm ash <command>
```

### Common Commands

- `ash help` - Display help information
- `ash version` - Display version information
- `ash clean` - Clean build artifacts and cache

## turbo-run (Interactive Script Runner)

`turbo-run` is an interactive script runner that helps you quickly execute scripts defined in package.json.

### Installation

```bash
pnpm install -g @aolarhapsody/turbo-run
```

Or use directly:

```bash
pnpm turbo-run
```

### Usage

After running the command, an interactive interface will be displayed, listing all available scripts. You can select and execute them using the arrow keys.

## Deployment Scripts

The [scripts/deploy/](https://github.com/vmoranv/aolarhapsody/tree/main/scripts/deploy) directory contains some deployment-related scripts:

- `build-local-docker-image.sh` - Build Docker image locally
- `Dockerfile` - Docker image build file
- `nginx.conf` - Nginx configuration file

### Building Docker Image

```bash
cd scripts/deploy
./build-local-docker-image.sh
```

## Custom Scripts

You can also find more available script commands in the `package.json` file in the project root directory:

```bash
# Development mode
pnpm dev

# Build project
pnpm build

# Code checking
pnpm check

# Code formatting
pnpm format

# Clean build artifacts
pnpm clean
```

These CLI tools and scripts greatly simplify the development, build, and deployment processes, improving development efficiency.
