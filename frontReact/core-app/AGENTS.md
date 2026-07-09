# core-app

Vite + React 19 + TypeScript 6 + React Compiler, acting as a **Module Federation host**.

## Quick start

```sh
make exec     # sobe remote-app + core-app via Docker
make down     # derruba
```

`make exec` na raiz do monorepo sobe todos os projetos de uma vez.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | `tsc -b && vite build` — typecheck **first**, then bundle |
| `npm run lint` | `eslint .` (flat config, ignores `dist`) |
| `npm run preview` | `vite preview` — serve the built `dist/` |

No test runner is configured.

## Module Federation

- Host name: `coreApp`
- Expects remote at `http://localhost:5001/assets/remoteEntry.js`
- The remote app must be running at port 5001 during dev
- Shared singletons (must stay singletons): `react`, `react-dom`, `react-router-dom`
- Lazy-loads `remoteApp/RemoteAppEntry` — see `src/App.tsx:6`
- Route for remote **must** use `/*` suffix: `<Route path="/remote/*">`

## TypeScript quirks

- **`verbatimModuleSyntax: true`** — use `import type` for type-only imports
- **`erasableSyntaxOnly: true`** — no `enum`, no `namespace`, no constructor parameter properties
- **`noUnusedLocals` / `noUnusedParameters`** — both enabled, remove or prefix unused vars with `_`
- `tsc -b` uses project references (`tsconfig.app.json` + `tsconfig.node.json`)

## Style & conventions

- Flat ESLint config (`eslint.config.js`), ESM (`"type": "module"`)
- No formatter config (no Prettier)
- React Compiler is active — may slow dev/build; the `babel-plugin-react-compiler` setup is in `vite.config.ts`
- No CI/CD, no pre-commit hooks, no test files in the repo
