# remote-app

React 19 + Vite 6 + TypeScript 6 — **Remote** do Module Federation. Porta 5001.

## Quick start

```sh
make exec     # sobe remote-app via Docker
make down     # derruba
```

`make exec` na raiz do monorepo sobe todos os projetos de uma vez.

## Desenvolvimento local

```sh
npm run dev       # Vite dev server (porta 5001)
npm run build     # tsc -b && vite build (typecheck + bundle)
npm run lint      # ESLint (flat config)
npm run preview   # preview do build (serve dist/)
```

## Module Federation

- Expõe `./RemoteAppEntry` via `@originjs/vite-plugin-federation`
- React Compiler **desativado** (conflita com federação)
- Roteamento próprio com `react-router-dom` (sub-router aninhado)

## TypeScript

- `verbatimModuleSyntax: true` — use `import type` / `export type`
- `erasableSyntaxOnly: true` — sem `enum`, sem `namespace`
- `noUnusedLocals` / `noUnusedParameters` — prefixe com `_` se não usado

## Quirk conhecido

`@originjs/vite-plugin-federation` v1.4.1 tem tipos quebrados no TS 6.0 — workaround em `vite-env.d.ts`.
