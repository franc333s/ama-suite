# ama-suite

Monorepo that brings together the websites of the ama ecosystem. Each website is an independent package with its own code, dependencies and README. They share the tooling and the way of working described here.

## Projects

| Package | What it is | Docs |
|---|---|---|
| [`ama-mostrador`](packages/ama-mostrador) | Website of Mostrador Gallery. Content managed in WordPress | [README](packages/ama-mostrador/README.md) |
| [`ama-martinez-siesta`](packages/ama-martinez-siesta) | Website that shows projects (home feed, project list and project detail). Content read from a WordPress site | Pending |

Both are React single-page apps built with Vite, TypeScript and Sass. Each package manages its own dependency versions, so they do not have to be on the same React version.

## Repository structure

```text
ama-suite/
├── package.json
├── pnpm-workspace.yaml
├── packages/              One folder per website
│   ├── ama-mostrador/
│   └── ama-martinez-siesta/
└── wordpress/             Code that runs on the WordPress servers, kept here under version control
```

`wordpress/` holds the plugins that the websites depend on (for example, the plugin that publishes the Mostrador content as static JSON). They are not part of any build: they are uploaded to the server by hand, and each package README explains how.

## Getting started

Requirements: Node.js and [pnpm](https://pnpm.io) (the version is set in `devEngines` in the root `package.json`). Use `pnpm` and not `npm`.

Install the dependencies once, from the repository root:

```bash
pnpm install
```

Run a package with a filter, always from the root:

```bash
pnpm --filter ama-mostrador dev
pnpm --filter ama-martinez-siesta dev
```

Running `tsc` or `vite` directly from the root fails, because they are only installed inside each package.

## Common commands

| Command | What it does |
|---|---|
| `pnpm --filter <package> dev` | Development server |
| `pnpm --filter <package> build` | Type check and production build, output in `packages/<package>/dist/` |
| `pnpm --filter <package> preview` | Serves the production build locally |
| `pnpm --filter <package> lint` | ESLint |
| `pnpm -r build` | Builds every package |

Environment variables, routes, content sources and deployment depend on each website: see its README.

## Working conventions

- **Branches:** day-to-day work happens on `develop`, or on `feature/*` branches merged into it.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org) style (`feat:`, `fix:`, `perf:`, `style:`, `docs:`, `chore:`), short and in English.
- **Before committing:** `lint` and `build` of the affected package must pass without errors.
- **Isolation:** a package does not import code from another one. If something has to be shared, it is discussed before creating a shared package.
- **Styles:** Sass, with BEM-style class names and one stylesheet per component.
- **Documentation:** project-specific details go in the README of that package. This README only covers what applies to the whole repository.
