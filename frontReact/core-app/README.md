# core-app

React 19 + Vite 6 + TypeScript 6 — **Host** do Module Federation. Porta 5173 (dev) / 5000 (Docker).

## Quick start

```sh
make exec     # sobe remote-app + core-app via Docker
make down     # derruba
```

`make exec` na raiz do monorepo sobe todos os projetos de uma vez.

## Desenvolvimento local

```sh
npm run dev       # Vite dev server (HMR)
npm run build     # tsc -b && vite build (typecheck + bundle)
npm run lint      # ESLint (flat config)
npm run preview   # preview do build (serve dist/)
```

## Module Federation

- Lazy-loads `remoteApp/RemoteAppEntry` de `http://localhost:5001/assets/remoteEntry.js`
- Rota do remote **deve** usar `/*`: `<Route path="/remote/*">`
- Singletons compartilhados: `react`, `react-dom`, `react-router-dom`
- React Compiler ativado via `babel-plugin-react-compiler`

## TypeScript

- `verbatimModuleSyntax: true` — use `import type` / `export type`
- `erasableSyntaxOnly: true` — sem `enum`, sem `namespace`
- `noUnusedLocals` / `noUnusedParameters` — prefixe com `_` se não usado
