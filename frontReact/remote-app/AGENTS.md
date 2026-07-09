# remote-app

Vite + React 19 + TypeScript 6.0 app. Module federation **remote** with its own nested React Router.

## Quick start

```sh
make exec     # sobe remote-app via Docker
make down     # derruba
```

`make exec` na raiz do monorepo sobe todos os projetos de uma vez.

## Commands

```sh
npm run dev       # Vite dev server (HMR)
npm run build     # tsc -b && vite build  (typecheck, then bundle)
npm run lint      # eslint .  (flat config)
npm run preview   # vite preview (serve built dist)
```

## Architecture

- **Entry**: `src/main.tsx` → `src/App.tsx`
- **Module federation**: `@originjs/vite-plugin-federation` declared in `package.json`. Configure in `vite.config.ts` using `federation()` plugin. This app exports components as a remote.
- **Routing**: `react-router-dom` v7 is a dependency. Implement nested routing inside `<App>` (sub-router / descending nested routes) so the remote has its own page navigation independent of the host router.
- **`src/pages/`** is empty. Create route pages and wire them in `src/routes/` (or inline in `App.tsx`). The `scructure.txt` file sketches a planned folder layout (`components/`, `hooks/`, `services/`, `routes/`, `styles/`).
- **React Compiler** is disabled (was removed because it conflicts with Module Federation — the remote's compiled components would fail with `Cannot read properties of null (reading 'useMemoCache')` when loaded by the host).

## TypeScript

- Project references: `tsconfig.json` → `tsconfig.app.json` (src) + `tsconfig.node.json` (configs).
- `verbatimModuleSyntax: true` — use `import type` / `export type` for type-only imports.
- `erasableSyntaxOnly: true` — no enums, no namespaces, no `declare class` with runtime semantics.
- `noUnusedLocals` / `noUnusedParameters` — lint-style, will error on build.

## Build order

`npm run build` runs `tsc -b` first (type-check all project references), then `vite build`. Do not skip the typecheck step.

## Known quirks

- `@originjs/vite-plugin-federation` v1.4.1 has broken types under TS 6.0 (`Plugin` type not imported in its `.d.ts`). Fixed by `vite-env.d.ts` (root) with a local `declare module '@originjs/vite-plugin-federation'` that imports `Plugin` from `vite`. Make sure `vite-env.d.ts` is listed in `tsconfig.node.json` `include`.

## Module federation notes

- The `@originjs/vite-plugin-federation` plugin must be added to `vite.config.ts`.
- The remote exposes components via `exposes` config. The host consumes them via `remotes`.
- Since this app also has its own router, exported page components should include their route tree, or the remote exports the full `<App>` which the host mounts at a path.
