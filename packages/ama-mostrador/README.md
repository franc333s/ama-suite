# ama-mostrador

Website of **Mostrador Gallery** (collectible design). A React + TypeScript single-page app built with Vite and Sass. All the content (Works, Exhibitions and the About page) is managed in WordPress and read from it by the website.

## Stack

- React 19, React Router 7
- TypeScript, Vite
- Sass (BEM-style class names, one `.scss` per component)
- DOMPurify, to sanitize the inline HTML that comes from WordPress
- WordPress + Pods as the content source, with a small plugin that publishes static JSON files (see [Content](#content-wordpress))

## Getting started

This package belongs to the `ama-suite` monorepo. Use `pnpm` from the repository root (see the root README):

```bash
pnpm install
pnpm --filter ama-mostrador dev       # http://localhost:3000
pnpm --filter ama-mostrador build     # tsc -b && vite build, output in dist/
pnpm --filter ama-mostrador preview
pnpm --filter ama-mostrador lint
```

### Environment

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `https://mostradorgallery.com` | Base URL of the WordPress site (no trailing slash) |

Copy `.env.example` to `.env` to change it. By default, development reads the production WordPress.

## Routes

| Route | Page |
|---|---|
| `/` | Home: hero with the video and the stone, then the works grid |
| `/works/:slug` | Work page |
| `/exhibitions` | Exhibitions grid ("Coming soon" while there are none) |
| `/exhibitions/:slug` | Exhibition page (same layout as a work, gallery up to 2 columns) |
| `/about` | About |
| `*` | 404 |

## Content (WordPress)

The website does not call the WordPress API on every visit, because booting WordPress takes about a second. Instead, a plugin generates static JSON files that Apache serves directly.

```text
WordPress (Pods)  ──►  wordpress/mostrador-works-json.php  ──►  wp-content/uploads/mostrador/*.json  ──►  website
                          (regenerates on every save)            works.json · exhibitions.json · about.json
```

If a JSON file does not exist, the website falls back to the regular REST API (`/wp-json/wp/v2/{work|exhibition}` and `/wp-json/mostrador/v1/about`).

### The plugin

[`wordpress/mostrador-works-json.php`](../../wordpress/mostrador-works-json.php) lives in this repository only as a backup and under version control. It runs on the server as a must-use plugin, in `wp-content/mu-plugins/`. **After changing it, upload it again** and press "Regenerar ahora" in WordPress admin > Tools > Mostrador JSON, which also shows the plugin version and the state of each JSON. Its header explains the details.

### Pods

Names matter: the website and the plugin read the fields by these exact names.

**`work`** and **`exhibition`** (custom post types, with REST enabled and the same fields):

| Field | Used for |
|---|---|
| Featured image | Card in the grid |
| `heroimage` | Image at the top of the page. If empty, the featured image is used |
| `designer`, `producttype`, `year`, `material`, `dimensions`, `namesecondary` | Page header |
| `productdescription` | "About" text. Allow multiple values: each value, and each line break, is a paragraph. Admits inline HTML (`a`, `strong`, `em`, `b`, `i`, `u`, `br`) |
| `editiontype` | "Edition" |
| `productgallery` | Repeatable group: `figindex`, `figtext`, `figimg`, `figimgalttext` |

**`about`** (custom post type, only its first published item is used). All fields are single-value ("Allow multiple values" off), except `text`:

| Field | Used for |
|---|---|
| `mailinfo` | "Contact" in the menu and the footer, and the email in About |
| `mailcontact` | "Inquire" button of the work and exhibition pages |
| `instagram` | Instagram link (full URL) in the menu and the footer |
| `based` | "Based" in About |
| `text` | About paragraphs (multiple values, same rules as `productdescription`) |
| `image` | Image in About |

An empty field is not rendered: the website has no default content for anything that comes from WordPress. For example, "Contact" and "Instagram" in the menu and the footer, and the "Purchase" block of a work, only appear when their fields have a value. The menu and footer links appear a moment after the page loads, when `about.json` arrives.

## Project structure

```text
src/
├── api/          Data layer. collection.ts is generic (works.ts and exhibitions.ts use it); about.ts for About
├── components/   One folder per component: Component.tsx, Component.interface.ts, Component.scss
├── hooks/        useAbout: About data shared by the menu, footer and buttons (one download per visit)
├── pages/        One component per route
├── scss/         abstracts (variables, mixins), base, utilities, views
├── types/        Product (used by works and exhibitions)
└── utils/        richText: splits and sanitizes WordPress text
```

## Deployment

The build (`pnpm --filter ama-mostrador build`) generates a static site in `dist/`. `public/.htaccess` (Apache: HTTPS redirect and fallback to `index.html`) and `public/_redirects` (fallback for hosts that support it) make the client-side routes work when reloaded. The hero video is loaded from the WordPress uploads (URL in `components/homePage/bgVideo/BgVideo.tsx`), and `index.html` includes the Cloudflare Web Analytics beacon.

## Conventions

- `lint` and `build` must pass without errors before committing.
- Anything editable from WordPress goes through the `api/` layer and is not hardcoded in components.
- HTML coming from WordPress is only rendered through `utils/richText.ts`, which sanitizes it.
- New post type in WordPress: add it to `MOSTRADOR_COLLECTIONS` in the plugin, create its API file with `createCollection`, and add the routes in `App.tsx`.
