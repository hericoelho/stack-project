# mySystem

Monorepo with 4 packages (startup order: mongo → backSpring + bff → core-app).

```
mongoBD/          — MongoDB 4.4 + mongo-express (port 8081)
backSpring/       — Spring Boot 3.5.16 / Java 17, MongoDB data layer
bff-nest-js/      — NestJS 11 BFF (port 3000), Express platform
frontReact/
  core-app/       — Module Federation HOST (Docker: 5000, dev: 5173), React 19, Vite 6
  remote-app/     — Module Federation REMOTE (Docker: 5001, dev: must use --port 5001), React 19, Vite 6
```

## Per-package AGENTS.md

Each front-end app has its own `AGENTS.md` with accurate per-package commands and quirks. Read them:

- `frontReact/core-app/AGENTS.md`
- `frontReact/remote-app/AGENTS.md`

## Docker & network

- All docker-compose files share networks by **external name** (`shared-mongo-network`, `shared-back-network`). Start `mongoBD/docker-compose.yml` first to create `shared-mongo-network`, then other services.
- `backSpring/docker-compose.yml` includes `mongoBD/docker-compose.yml` and auto-creates the mongo network.
- `frontReact/remote-app/docker-compose.yml` is standalone (port 5001).
- `frontReact/core-app/docker-compose.yml` includes `remote-app/docker-compose.yml` — run from `core-app/` directory.
- **Do not mount volumes** over `dist/` when testing static preview builds — the volume shadows the container-built dist.

## backSpring (Spring Boot)

- Java 17, Maven wrapper (`./mvnw`), Lombok (annotation processor auto-configured).
- `./mvnw spring-boot:run` for dev, `./mvnw test` for tests.
- Connects to `mongodb` host on port 27017 (Docker network), credentials via `MONGO_USER` / `MONGO_PASSWORD` env vars.
- Single test: `BackApplicationTests.contextLoads()` — smoke test that needs MongoDB running.

## bff-nest-js (NestJS BFF)

```sh
npm run start:dev   # watch mode
npm run test        # unit (Jest, **/*.spec.ts)
npm run test:e2e    # e2e (test/app.e2e-spec.ts, config at test/jest-e2e.json)
npm run lint        # ESLint + Prettier (auto-fix on)
npm run format      # Prettier write
```

- TypeScript `nodenext` module, **`noImplicitAny: false`**, decorators enabled.
- ESLint sourceType is `commonjs` (despite ESM in tsconfig — NestJS CLI quirk).
- Prettier: `singleQuote: true`, `trailingComma: all`.
- E2E tests use `supertest` and a separate Jest config.

## frontReact (core-app + remote-app)

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | `tsc -b && vite build` — typecheck **first**, then bundle |
| `npm run lint` | `eslint .` (flat config) |
| `npm run preview` | `vite preview` (serve `dist/`) |

### Module Federation

- **Host** (`core-app`): lazy-loads `remoteApp/RemoteAppEntry` from `http://localhost:5001/assets/remoteEntry.js`. Route **must** use `/*` suffix.
- **Remote** (`remote-app`): exposes `./RemoteAppEntry` from `./src/RemoteAppEntry.tsx`.
- Shared singletons: `react`, `react-dom`, `react-router-dom`.
- React Compiler: **enabled** in core-app (via `babel-plugin-react-compiler`), **disabled** in remote-app (conflicts with federation).

### TypeScript quirks (both apps)

- `verbatimModuleSyntax: true` → use `import type` / `export type`.
- `erasableSyntaxOnly: true` → no `enum`, no `namespace`.
- `noUnusedLocals` / `noUnusedParameters` → prefix unused vars with `_`.
- `@originjs/vite-plugin-federation` v1.4.1 has broken TS 6.0 types — workaround in `remote-app/vite-env.d.ts`.

## Dockerfile note

All `Dockerfile`s reference `node:krypton-alpine` base image. This is **not** an official Node image — verify it exists or replace with `node:lts-alpine` if CI fails.
