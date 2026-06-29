# mySystem

Monorepo full-stack com **micro-frontends** usando Module Federation. Arquitetura orientada a:

```
MongoDB → Spring Boot API → NestJS BFF → React (Host + Remote)
```

## Estrutura

| Pacote | Tecnologia | Porta | Função |
|--------|-----------|-------|--------|
| `mongoBD/` | MongoDB 4.4 + mongo-express | 27017 / 8081 | Banco de dados e admin |
| `backSpring/` | Spring Boot 3.5.16 / Java 17 | 8080 | API REST com MongoDB |
| `bff-nest-js/` | NestJS 11 / Express | 3000 | BFF (Backend for Frontend) |
| `frontReact/core-app/` | React 19 + Vite 6 | 5173 (dev) / 5000 (Docker) | **Host** do Module Federation |
| `frontReact/remote-app/` | React 19 + Vite 6 | 5001 (dev/Docker) | **Remote** do Module Federation |

## Pré-requisitos

- Docker e Docker Compose
- Java 17 (para desenvolvimento local do backSpring)
- Node.js 22+ (para desenvolvimento local dos apps front-end)
- Maven (via `./mvnw` no backSpring)

## Como rodar

### Docker (toda a stack)

```sh
# 1. Banco de dados
cd mongoBD && docker compose up -d

# 2. Backend Spring Boot
cd backSpring && docker compose up -d

# 3. BFF NestJS
cd bff-nest-js && docker compose up -d

# 4. Micro-frontends (o host já inclui o remote)
cd frontReact/core-app && docker compose up -d
```

**Ordem obrigatória:** mongo → backSpring + bff (paralelo) → core-app (depende do remote).

### Desenvolvimento local

```sh
# Terminal 1: Remote App (deve rodar na porta 5001)
cd frontReact/remote-app
npm install && npm run dev -- --port 5001

# Terminal 2: Host App
cd frontReact/core-app
npm install && npm run dev

# Terminal 3: BFF
cd bff-nest-js
npm install && npm run start:dev

# Terminal 4: Spring Boot (precisa de MongoDB rodando)
cd backSpring
./mvnw spring-boot:run
```

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Cliente (navegador)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  core-app (Host) — porta 5173/5000                   │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  / (Home)                                       │   │   │
│  │  │  /remote/* → RemoteAppEntry (lazy) ──────┐     │   │   │
│  │  └──────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │ Module Federation (JS bundling)    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  remote-app (Remote) — porta 5001                   │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  / (Home) | /alt (AltPage)                     │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │ HTTP
                           ▼
              ┌─────────────────────────┐
              │  bff-nest-js (BFF)      │
              │  porta 3000             │
              │  GET / → "Hello World!" │
              └─────────────────────────┘
                           │ HTTP
                           ▼
              ┌─────────────────────────┐
              │  backSpring (API)       │
              │  porta 8080             │
              │  Spring Boot + MongoDB  │
              └─────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  MongoDB 4.4            │
              │  mongo-express (8081)   │
              └─────────────────────────┘
```

## Redes Docker

- `shared-mongo-network`: conexão entre MongoDB, mongo-express e Spring Boot
- `shared-back-network`: conexão entre Spring Boot e NestJS BFF
- Os frontends (Host e Remote) comunicam-se via `localhost` do host — não usam rede Docker compartilhada

## Comandos de desenvolvimento

### backSpring (Spring Boot)

```sh
./mvnw spring-boot:run   # Servidor de desenvolvimento
./mvnw test              # Rodar testes
./mvnw clean package     # Build JAR
```

### bff-nest-js (NestJS)

```sh
npm run start:dev    # Watch mode
npm run build        # Compilar
npm run test         # Testes unitários (Jest)
npm run test:e2e     # Testes e2e (supertest)
npm run lint         # ESLint + Prettier (auto-fix)
npm run format       # Prettier write
```

### frontReact (core-app + remote-app)

```sh
npm run dev       # Dev server (HMR)
npm run build     # tsc -b && vite build (typecheck + bundle)
npm run lint      # ESLint (flat config)
npm run preview   # Preview do build (serve dist/)
```

## Observações importantes

- **React Compiler**: ativado no **core-app** (host) via `babel-plugin-react-compiler`, desativado no **remote-app** (conflita com Module Federation — causa erro `useMemoCache`)
- **TypeScript 6.0**: ambos os apps front-end usam `verbatimModuleSyntax: true` (use `import type`), `erasableSyntaxOnly: true` (sem `enum`/`namespace`), `noUnusedLocals`/`noUnusedParameters` (prefixe com `_`)
- **Module Federation**: o remote é carregado de `http://localhost:5001/assets/remoteEntry.js`. A rota do host **deve** usar `/*` (`path="/remote/*"`). Singletons compartilhados: `react`, `react-dom`, `react-router-dom`
- **Plugin Federation TS**: `@originjs/vite-plugin-federation` v1.4.1 tem tipos quebrados no TS 6.0 — o `remote-app` tem workaround em `vite-env.d.ts`; o `core-app` usa `@ts-expect-error`
- **BFF NestJS**: ESLint com `sourceType: 'commonjs'` (quirk do NestJS CLI), `noImplicitAny: false`, decorators ativados, Prettier com `singleQuote`
- **Spring Boot**: conecta-se ao MongoDB via hostname `mongodb` (Docker), porta 27017, database `meubanco`. Credenciais via variáveis de ambiente `MONGO_USER` e `MONGO_PASSWORD`
- **Teste do Spring Boot**: `BackApplicationTests.contextLoads()` — smoke test que **precisa** de MongoDB rodando

