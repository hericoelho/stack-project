# bff-nest-js

NestJS 11 BFF (porta 3000). Express platform. Comunica-se com `backSpring` via rede Docker.

## Quick start

```sh
make exec     # sobe mongoDB + backSpring + bff via Docker
make down     # derruba
```

`make exec` na raiz do monorepo sobe todos os projetos de uma vez.

## Commands

```sh
npm run start:dev   # watch mode
npm run test        # unit (Jest, **/*.spec.ts)
npm run test:e2e    # e2e (test/app.e2e-spec.ts, config at test/jest-e2e.json)
npm run lint        # ESLint + Prettier (auto-fix on)
npm run format      # Prettier write
```

## Docker

```sh
docker compose up --build -d
```

Usa `BACKEND_BASE_URL=http://backend:8080/api` (DNS Docker).

## Quirks

- TypeScript `nodenext` module, **`noImplicitAny: false`**, decorators enabled.
- ESLint sourceType is `commonjs` (despite ESM in tsconfig — NestJS CLI quirk).
- Prettier: `singleQuote: true`, `trailingComma: all`.
- E2E tests use `supertest` and a separate Jest config.
