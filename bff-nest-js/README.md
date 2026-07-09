# bff-nest-js

NestJS 11 BFF (Backend for Frontend) — porta 3000. Comunica-se com o microserviço `backSpring` via rede Docker.

## Quick start

```sh
make exec     # sobe mongoDB + backSpring + bff via Docker
make down     # derruba
```

`make exec` na raiz do monorepo sobe todos os projetos de uma vez.

## Desenvolvimento local

```sh
npm run start:dev   # watch mode (precisa de backSpring rodando)
npm run test        # unit (Jest, **/*.spec.ts)
npm run test:e2e    # e2e (test/app.e2e-spec.ts)
npm run lint        # ESLint + Prettier (auto-fix on)
npm run format      # Prettier write
```

## Docker

```sh
docker compose up --build -d
```

O container usa `BACKEND_BASE_URL=http://backend:8080/api` (DNS Docker).  
Localmente, o `.env` usa `http://localhost:8080/api` (porta publicada no host).
