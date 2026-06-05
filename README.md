# CusCuciin — Laundry Client

Admin dashboard and public storefront for the CusCuciin laundry management system, built with Next.js 13 + TypeScript.

## Requirements

- **pnpm** (package manager)
- **Node.js** v20.19.0 (use `nvm use` — `.nvmrc` is provided)
- **laundry-server** running on `http://localhost:3001` (the dev proxy target)

## Technology Stack

1. **Next.js 13** (Pages Router)
2. **TypeScript** with strict mode
3. **React 18**
4. **Bootstrap 5** + React-Bootstrap
5. **TanStack React Query** (API state management)
6. **TanStack React Table** (data tables)
7. **React Hook Form** + **Zod** (form handling & validation)
8. **SCSS** (styling)
9. **Axios** (HTTP client)
10. **Font Awesome** + React Feather (icons)

## Quick Start

1. Clone the repository
2. Use the correct Node version:
   ```sh
   nvm use
   ```
3. Install dependencies:
   ```sh
   pnpm install
   ```
4. Ensure `.env.local` exists with the API URI:
   ```
   NEXT_PUBLIC_API_URI=http://localhost:3001
   UPLOAD_DOMAINS=localhost
   ```
5. Start the dev server:
   ```sh
   pnpm dev
   # Client runs on http://localhost:3379
   ```

> **Note:** The dev server proxies API requests to the backend via the `"proxy": "http://localhost:3001"` field in `package.json`.

## HTTPS Dev Server

For local development with secure cookies:

```sh
node server.js
# Runs on https://localhost:3379
# Requires localhost.pem and localhost-key.pem in the project root
```

## Commands

| Command | Description |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start Next.js dev server (port 3379) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint (Airbnb + TypeScript + Prettier) |
| `pnpm lint:fix` | Auto-fix lint issues |

## Project Structure

```
src/
├── components/        # UI components organized by category
│   ├── Alerts/
│   ├── Badges/
│   ├── Buttons/
│   ├── Cards/
│   ├── Charts/
│   ├── Code/
│   ├── Dropdowns/
│   ├── Forms/
│   ├── Inputs/
│   ├── Modals/
│   ├── Navbar/
│   ├── Paginate/
│   ├── Sidebar/
│   ├── Tables/
│   ├── Toasts/
│   └── Typography/
├── configs/           # App config (navigation, pages, themes, charts, variables)
├── layouts/           # Page layouts (Admin, Auth, Web, Member, Misc)
├── pages/             # Next.js Pages Router
│   ├── admin/         # Admin dashboard routes
│   ├── daftar/        # Member registration
│   ├── kontak/        # Contact page
│   ├── layanan/       # Services catalog
│   ├── login/         # Login pages
│   ├── m/             # Member area
│   ├── pembayaran/    # Payment pages
│   └── tentang/       # About page
├── services/          # API client layer (one file per backend resource)
├── styles/            # SCSS stylesheets (variables, mixins, components, pages)
└── utils/             # Hooks, context, schemas, types, helpers
```

## Path Aliases

Import aliases are configured in `tsconfig.json`:

```typescript
@components/*   → ./src/components/*
@layouts/*      → ./src/layouts/*
@services/*     → ./src/services/*
@configs/*      → ./src/configs/*
@utils/*        → ./src/utils/*
@styles/*       → ./src/styles/*
@hooks/*        → ./src/utils/hooks/*
@interfaces     → ./src/utils/interfaces.ts
@types          → ./src/utils/types.ts
@/*             → ./src/*
```

## Route Structure

- **Public (storefront):** `/`, `/layanan`, `/tentang`, `/kontak`
- **Auth:** `/login`, `/daftar`
- **Member area:** `/m/*` (order history, profile, order tracking)
- **Payment:** `/pembayaran/*`
- **Admin dashboard:** `/admin/*` (orders, payments, customers, reports, settings)

## Key Design Notes

- **Two surface areas:** Public storefront (`/`) and admin dashboard (`/admin/*`) share the same Next.js instance but use different layouts (`WebLayout` vs `AdminLayout`).
- **API proxy:** During development, API requests are proxied to `http://localhost:3001` via `package.json`'s `proxy` field — no CORS issues locally.
- **Upload domains:** `UPLOAD_DOMAINS` in `.env.local` is consumed by `next.config.js` to whitelist `next/image` domains for external images.
- **Strict TypeScript:** `strict: true` is enabled — expect to handle missing return types and unused vars warnings.
- **ESLint is strict:** Extends `airbnb`, `airbnb-typescript`, `next/core-web-vitals`, and `prettier`.

## Notes

- The `.env.local` file is committed (contains `localhost` dev values). For production, update `NEXT_PUBLIC_API_URI` to the actual API URL and `UPLOAD_DOMAINS` to the production domain.
- `husky` is listed in `devDependencies` but no `.husky/` directory exists — pre-commit hooks are **not active** (see `.dev/TECHNICAL_DEBT.md` KI-03).
- See `AGENTS.md` in the repo root for full development conventions and known issues.