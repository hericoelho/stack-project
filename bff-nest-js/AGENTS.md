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

## RabbitMQ Integration

### Arquitetura

O BFF roda como **hybrid application** (NestJS): HTTP (REST + SSE) e RMQ consumer
na mesma instância. Usa `amqplib` + `amqp-connection-manager` (NÃO `@nestjs/microservices`).

```
Spring Boot ──publish──▶ RabbitMQ (activity.status.changed)
                              │
                              ▼
                         BFF NestJS (hybrid app)
                         ├── RMQ Consumer (@EventPattern)  ← Etapa 1
                         │       │
                         │       ▼
                         │   SSE Service (Subject)         ← Etapa 2
                         │       │
                         └── SSE Controller (@Sse)         ← Etapa 2
                                │
                                ▼
                           Frontend (EventSource)          ← Etapa 2
```

### Por que NÃO usar @nestjs/microservices

`@nestjs/microservices` com `Transport.RMQ` espera que a mensagem tenha formato de pacote:
```json
{ "pattern": "activity.status.changed", "data": { ... } }
```
O Spring Boot publica JSON puro (sem wrapper), causando `Event pattern: undefined`.
Usar `amqplib` + `amqp-connection-manager` consome qualquer formato JSON diretamente.

### RabbitMQ Config

| Item | Valor |
|------|-------|
| Queue | `activity.status.changed` (durável) |
| Exchange | `activity.exchange` (topic, declarado pelo Spring) |
| Routing Key | `activity.status.changed` |
| Credenciais | `rabbitUser` / `rabbitPwd` |
| Host (Docker) | `rabbitmq:5672` |
| Host (dev local) | `localhost:5672` |

### Mensagem (ActivityStatusChangedMessage)

Publicada pelo Spring como JSON:
```json
{
  "activityId": "665a1b2c3d4e5f6a7b8c9d0e",
  "title": "Estudar Spring Boot",
  "newStatus": "PLAN",
  "timestamp": "2026-07-14T22:02:00Z"
}
```

### Fluxo de transição de status

```
POST /api/v1/activities → CREATE (PREPARING) → schedule delay 2min
                                                        ↓
                                              UPDATE to PLAN + publish to RabbitMQ
                                                        ↓
                                              BFF consome → (Etapa 2: SSE → Frontend)
```

### Tolerância a falhas

- **Reconexão automática**: `amqp-connection-manager` reconecta automaticamente quando o RabbitMQ cai e volta (`reconnectTimeInSeconds: 5`).
- **Competing consumers**: BFF consome da mesma fila `activity.status.changed`. Se houver múltiplos consumidores, cada mensagem vai para apenas um.
- **Setup idempotente**: BFF declara exchange + queue + binding no `onModuleInit`. Se o Spring já criou, apenas confirma. Se o Spring ainda não criou, o BFF cria.

### Arquivos-chave

| Caminho | Responsabilidade |
|---------|-----------------|
| `src/activities/rabbitmq/rabbitmq.service.ts` | Consumer RMQ — connect + consume via `amqplib` |
| `src/activities/activities.module.ts` | Registra `RabbitmqService` como provider |
| `src/main.ts` | Bootstrap padrão (NÃO hybrid microservice) |
| `.env` | `RABBITMQ_HOST`, `RABBITMQ_USER`, `RABBITMQ_PASS` |
| `docker-compose.yml` | Env vars do RabbitMQ para container |

### Setup do channel (IMPORTANTE)

Usar **`setup` callback** no `createChannel` do `amqp-connection-manager`.
NÃO chamar `assertExchange()`, `assertQueue()`, `bindQueue()`, `consume()` individualmente —
o `ChannelWrapper` não garante encadear essas operações fora do `setup`.

```typescript
connection.createChannel({
  setup: async (ch: Channel) => {
    await ch.assertExchange(this.EXCHANGE, 'topic', { durable: true });
    await ch.assertQueue(this.QUEUE, { durable: true });
    await ch.bindQueue(this.QUEUE, this.EXCHANGE, this.ROUTING_KEY);
    ch.consume(this.QUEUE, (msg: ConsumeMessage | null) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString()) as Record<string, unknown>;
        ch.ack(msg);
      }
    });
  },
});
```

### Tipos TypeScript

- `Channel` e `ConsumeMessage` vêm de `amqplib` (via `@types/amqplib`).
- Usar `import type { Channel, ConsumeMessage } from 'amqplib'` (type-only import).
- `amqp-connection-manager` re-exporta `Channel` como `amqplib.ConfirmChannel | amqplib.Channel`.
- `JSON.parse()` retorna `any` — cast explícito: `as Record<string, unknown>`.

### Docker

RabbitMQ está em `../queueRabbitMQ/docker-compose.yml` (rede `shared-back-network`).
O BFF já conecta nessa rede. Variáveis de ambiente necessárias:

```yaml
environment:
  RABBITMQ_HOST: rabbitmq
  RABBITMQ_USER: rabbitUser
  RABBITMQ_PASS: rabbitPwd
```

### Status de implementação

- [x] **Etapa 1**: RabbitMQ consumer — conectar à fila e receber mensagens
- [ ] **Etapa 2**: SSE — broadcast das mensagens consumidas para o frontend

### Possíveis problemas

| Problema | Causa | Solução |
|----------|-------|---------|
| `Event pattern: undefined` | Usou `@nestjs/microservices` com Spring | Usar `amqplib` direto (documentado acima) |
| `NOT_FOUND - no queue` | BFF inicia antes do Spring criar a fila | BFF declara exchange+queue+binding (já implementado) |
| `connect ECONNREFUSED` | RabbitMQ não está rodando | Suba `queueRabbitMQ` primeiro |
| `ACCESS_REFUSED` | Credenciais erradas | Verifique `RABBITMQ_USER` / `RABBITMQ_PASS` |
| ESLint `unsafe` errors | Tipos não resolvidos do `amqplib` | Usar `import type` + cast explícito |
