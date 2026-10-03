# ama-suite

ama-suite is a monorepo that brings together multiple internal projects under a single repository. At the moment, it contains two frontend applications that are developed and maintained as part of the same ecosystem.

## Overview

This workspace is designed to simplify collaboration and shared maintenance across related products. The current structure includes:

- ama-mostrador
- ama-martinez-siesta

Both projects are modern React applications built with Vite for fast development and production builds. Styling is handled with Sass, and the setup includes linting and tooling to support a clean development workflow.

## Projects

### ama-mostrador
A React-based application built with Vite and TypeScript, focused on delivering a modern and maintainable user experience.

### ama-martinez-siesta
A React-based application built with Vite, designed as another internal project within the monorepo.

## Tech stack

- React
- Vite
- Sass
- ESLint
- TypeScript (used in ama-mostrador)

## Repository structure

The repository is organized as a root workspace that hosts multiple internal projects under the packages directory:

```text
ama-suite/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   ├── ama-mostrador/
│   └── ama-martinez-siesta/
```

Each project is managed as its own package while still benefiting from the shared monorepo setup.

## Getting started

Make sure you have Node.js installed and use pnpm as the package manager.

Install dependencies from the repository root:

```bash
pnpm install
```

Run a specific application from the root:

```bash
pnpm --filter ama-mostrador dev
pnpm --filter ama-martinez-siesta dev
```

## Building for production

Run the build for a specific application from the repository root (dependencies must be installed first with `pnpm install`):

```bash
pnpm --filter ama-mostrador build
pnpm --filter ama-martinez-siesta build
```

Each build runs `tsc -b && vite build` and outputs the result to the `dist/` folder inside the corresponding package (for example `packages/ama-mostrador/dist/`).

To build every project at once:

```bash
pnpm -r build
```

To preview a production build locally:

```bash
pnpm --filter ama-mostrador preview
pnpm --filter ama-martinez-siesta preview
```

Note: use `pnpm` rather than `npm`, and run the scripts through it. Running `tsc` or `vite` directly will fail because they are only available inside each package's `node_modules`.

## Development workflow

To keep the monorepo consistent, the following practices are recommended:

- Install dependencies at the root so the workspace is configured correctly.
- Run project-specific commands from the root using pnpm filters.
- Keep each internal project isolated in its own package folder.
- Use shared conventions for styling, tooling, and linting as the monorepo grows.

## Shared conventions

As the monorepo evolves, the goal is to keep shared standards consistent across projects. This includes:

- consistent use of React and Vite across internal apps
- shared styling practices with Sass
- common linting and build tooling
- reusable configuration patterns as the number of projects grows

This monorepo structure makes it easier to evolve shared conventions, keep projects aligned, and work on multiple internal apps from one place.