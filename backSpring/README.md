# backSpring

API REST para gerenciamento de atividades, construída com Spring Boot 3.5.16 e Java 17. Utiliza **Hexagonal Architecture (Ports & Adapters)** com **Clean Architecture** e **SOLID**.

## Funcionalidades

- **CRUD de Atividades** — criação e listagem via REST API
- **Transição automática de status** — atividades criadas com status `PREPARING` transicionam automaticamente para `PLAN` após delay configurável (default: 2 minutos)
- **Mensageria RabbitMQ** — ao transicionar status, publica evento na fila `activity.status.changed` para consumo por outros serviços (ex: BFF)
- **Retry com backoff exponencial** — publicação na fila com até 3 tentativas (2s, 4s, 8s) antes de falhar
- **Persistência MongoDB** — armazenamento em `meubanco`, collection `activities`

### Endpoints

| Método | Path | Descrição | Status Code |
|--------|------|-----------|-------------|
| `POST` | `/api/v1/activities` | Cria atividade (status inicial: `PREPARING`) | `201 Created` |
| `GET` | `/api/v1/activities` | Lista todas as atividades | `200 OK` |

#### Request — Criar Atividade

```json
POST /api/v1/activities
Content-Type: application/json

{
  "title": "Estudar Spring Boot",
  "description": "Hexagonal Architecture",
  "type": "STUDY"
}
```

| Campo | Tipo | Obrigatório | Valores |
|-------|------|-------------|---------|
| `title` | string | sim | não vazio |
| `description` | string | não | — |
| `type` | string | sim | `STUDY`, `PROJECT`, `READING`, `EVENT` |

#### Response — Criar Atividade

```json
{
  "id": "665a1b2c3d4e5f6a7b8c9d0e",
  "title": "Estudar Spring Boot",
  "description": "Hexagonal Architecture",
  "type": "STUDY",
  "status": "PREPARING",
  "createdAt": "2026-07-14T22:00:00Z"
}
```

> Após 2 minutos, o `status` muda automaticamente de `PREPARING` para `PLAN` e um evento é publicado na fila RabbitMQ.

### Transição de Status

```
POST /api/v1/activities → CREATE (PREPARING) → aguarda 2min
                                                      ↓
                                          UPDATE para PLAN + publica no RabbitMQ
```

- **Delay configurável:** propriedade `activity.status.transition.delay-ms` (default: `120000` = 2 min)
- **Mensagem publicada:**

```json
{
  "activityId": "665a1b2c3d4e5f6a7b8c9d0e",
  "title": "Estudar Spring Boot",
  "newStatus": "PLAN",
  "timestamp": "2026-07-14T22:02:00Z"
}
```

---

## Code Formatting — Spring Java Format

O projeto utiliza [Spring Java Format](https://github.com/spring-io/spring-javaformat) para manter consistência de estilo (120 chars/linha, whitespace conventions).

### Comandos

```sh
# Formatar todo o código
./mvnw spring-javaformat:apply

# Validar formatação (roda automaticamente no build via phase validate)
./mvnw validate

# Skip temporário
./mvnw validate -Dspring-javaformat.skip=true
```

### IntelliJ IDEA

Instale o plugin **"Spring Java Format"** (https://github.com/spring-io/spring-javaformat#intellij-idea). O plugin se ativa automaticamente ao detectar o plugin Maven no `pom.xml` e exibe um ícone na status bar. Use `Code > Reformat Code` para formatar.

---

## Como Rodar

### Pré-requisitos

- Java 17+
- Docker e Docker Compose (ou Podman)
- MongoDB (porta 27017)
- RabbitMQ (porta 5672)

### Opção 1 — Docker Compose (recomendado)

Sobe o backend junto com as dependências (MongoDB + RabbitMQ via rede compartilhada):

```sh
docker compose up --build -d
```

> O `docker-compose.yml` assume que `shared-mongo-network` já existe. Suba o `mongoBD/docker-compose.yml` primeiro ou use o monorepo `make exec`.

### Opção 2 — Make (monorepo)

Na raiz do monorepo (`mySystem/`):

```sh
make exec     # sobe mongoDB + backSpring via Docker
make down     # derruba tudo
```

### Opção 3 — Maven (desenvolvimento local)

Requer MongoDB e RabbitMQ rodando separadamente (ex: via Docker).

```sh
# Compilar e rodar
./mvnw spring-boot:run

# Rodar todos os testes
./mvnw test

# Rodar teste específico
./mvnw test -Dtest=BackApplicationTests
```

> Para testes unitários (sem infraestrutura), use JUnit 5 + Mockito diretamente. Para testes de integração (`@SpringBootTest`), MongoDB deve estar rodando.

---

## Variáveis de Ambiente

| Variável | Descrição | Default (application.properties) |
|----------|-----------|----------------------------------|
| `MONGO_USER` | Usuário MongoDB | — (obrigatório) |
| `MONGO_PASSWORD` | Senha MongoDB | — (obrigatório) |
| `SPRING_DATA_MONGODB_URI` | URI completa de conexão MongoDB | — |
| `RABBITMQ_USER` | Usuário RabbitMQ | — (obrigatório) |
| `RABBITMQ_PASSWORD` | Senha RabbitMQ | — (obrigatório) |
| `RABBITMQ_HOST` | Host do RabbitMQ | `localhost` |
| `activity.status.transition.delay-ms` | Delay da transição PREPARING→PLAN (ms) | `120000` (2 min) |

---

## RabbitMQ

- **Serviço Docker:** `rabbitmq` (`rabbitmq:management-alpine`)
- **Portas:** 5672 (AMQP), 15672 (Management UI — `http://localhost:15672`)
- **Credenciais Management UI:** `rabbitUser` / `rabbitPwd`
- **Queue:** `activity.status.changed` (durável)
- **Exchange:** `activity.exchange` (topic)
- **Routing Key:** `activity.status.changed`
- **Retry:** 3 tentativas, backoff exponencial (2s → 4s → 8s)

---

## Arquitetura

```
com.coelho.back/
├── domain/                      # Core: regras de negócio puras (sem Spring)
│   └── model/                   # Activity, ActivityStatus, ActivityType
├── application/                 # Core: casos de uso e portas (sem Spring)
│   ├── usecase/                 # CreateActivityUseCaseImpl, UpdateActivityStatusUseCaseImpl
│   └── ports/
│       ├── in/                  # CreateActivityUseCase, ListActivitiesUseCase, UpdateActivityStatusUseCase
│       └── out/                 # ActivityRepositoryPort, ActivityEventPublisherPort, ScheduleActivityTransitionPort
├── infrastructure/              # Adaptadores e configurações Spring
│   ├── config/                  # UseCaseConfig, RabbitMQConfig, SchedulerConfig
│   └── adapters/
│       ├── in/web/              # ActivityController + DTOs
│       └── out/
│           ├── database/        # ActivityRepositoryAdapter + ActivityDocument
│           ├── rabbitmq/        # RabbitMQActivityEventPublisher + ActivityStatusChangedMessage
│           └── scheduler/       # TaskSchedulerActivityTransitionAdapter
```

### Regras de dependência entre camadas

1. **`domain`** — Java puro, zero anotações Spring
2. **`application`** — depende apenas de `domain`. Nunca importa `infrastructure`
3. **`infrastructure`** — implementa interfaces de `domain` + `application`. Todas as anotações Spring ficam aqui

---

## Stack

| Componente | Versão |
|------------|--------|
| Java | 17 |
| Spring Boot | 3.5.16 |
| MongoDB | 4.4 |
| RabbitMQ | 3.x (management) |
| Lombok | — |
| spring-retry | — |
| spring-javaformat | 0.0.47 |
| Maven | 3.9.6 (wrapper) |
