# backSpring

Spring Boot 3.5.16 / Java 17 + MongoDB. **Hexagonal Architecture (Ports & Adapters) + Clean Architecture + SOLID.**

## Quick start

```sh
make exec     # sobe mongoDB + backSpring via Docker
make down     # derruba
```

`make exec` na raiz do monorepo sobe todos os projetos de uma vez.

## Commands

```sh
./mvnw spring-boot:run   # dev (needs MongoDB on mongodb:27017)
./mvnw test              # all tests
./mvnw test -Dtest=BackApplicationTests  # single test
```

Docker: `docker compose up --build -d` in this directory (includes `mongoBD/docker-compose.yml`).

## Architecture — package layout under `com.coelho.back`

```
com.coelho.back/
│
├── domain/                      # 1. CORE: Regras de negócio puras (Sem Spring!)
│   ├── model/                   # Entidades de negócio puras (sem anotações @Entity)
│   └── exception/               # Exceções de negócio (ex: SaldoInsuficienteException)
│
├── application/                 # 2. CORE: Casos de uso e Portas (Sem Spring!)
│   ├── usecase/                 # Antigo 'service'. Lógica de cenários específicos
│   └── ports/                   # Interfaces de comunicação (O coração do Hexagonal)
│       ├── in/                  # Portas de Entrada (Input Ports - ex: interfaces dos UseCases)
│       └── out/                 # Portas de Saída (Output Ports - antigo 'repository' interface)
│
├── infrastructure/              # 3. DETALHES: Onde o Spring Boot e o mundo externo vivem
│   ├── config/                  # Configurações do Spring e injeção manual de Beans
│   ├── adapters/                # Adaptadores (Implementações das portas)
│   │   ├── in/                  # Adaptadores de Entrada (ex: Controllers, Listeners de fila)
│   │   │   ├── web/             # Antigo 'controller' + seus 'dtos' de request/response
│   │   │   └── queue/           # Consumidores de mensageria
│   │   └── out/                 # Adaptadores de Saída (ex: Banco de dados, APIs externas)
│   │       ├── database/        # Antigo 'repository' (Spring Data) + 'entities' (JPA)
│   │       └── client/          # Clientes HTTP (Feign, WebClient) para APIs externas
│   └── mapper/                  # Conversores entre Objetos Web/JPA e Objetos de Domínio
│
└── BackApplication.java      # Inicializador do Spring (fica na raiz da infraestrutura)
```


Onde foi parar cada pasta do Spring Boot tradicional?

* model virou duas coisas distintas:
  * O domain/model/ possui apenas classes Java puras (POJOs), contendo a lógica de negócio interna. Não têm anotações como @Entity, @Table ou @Id.
  * As tabelas e anotações do banco de dados ficam escondidas em infrastructure/adapters/out/database/ como entidades JPA de infraestrutura.
* service virou usecase:
  * Toda a lógica de processos foi para application/usecase/. Essas classes implementam as portas de entrada (ports/in). Elas também são Java puro e não usam a anotação @Service do Spring.
* repository virou ports/out e adapters/out:
  * No core (application/ports/out), você cria apenas uma interface Java comum (ex: ProductRepositoryPort).
  * Na infraestrutura (infrastructure/adapters/out/database/), você cria a interface do Spring Data JPA que você já conhece (SpringDataProductRepository) e uma classe que implementa a porta do seu core, fazendo a ponte entre os dois.
* controller e dto viraram adapters/in/web:
  * Os controladores HTTP são adaptadores que recebem o mundo externo e chamam as portas de entrada (ports/in) da aplicação. Seus DTOs específicos de API moram juntos aqui.
* config continua na infraestrutura:Como as classes em usecase não usam @Service (para não depender do Spring), você usa a pasta infrastructure/config/ para criar uma classe de configuração que instancia e expõe esses casos de uso como @Bean manualmente.

### Layer dependency rules

1. **`domain`** — pure Java, zero Spring annotations, zero outward dependencies.
2. **`application`** — depends only on `domain`. Imports domain interfaces and DTOs. Never imports `infrastructure`.
3. **`infrastructure`** — implements `domain` + `application` interfaces. **All Spring annotations live here.**

### Conventions

| Rule | Detail |
|------|--------|
| Injection | Constructor only via Lombok `@RequiredArgsConstructor`. Never `@Autowired` on fields. |
| REST base path | `/api/v1/...` |
| MongoDB entities | Inside `infrastructure/adapters/output/persistence` — **not** in `domain`. Domain entities are pure POJOs. |
| Mapping | Converter/mapper layer between persistence documents and domain entities. |
| Tests | `@SpringBootTest` for integration; pure JUnit 5 + Mockito for unit tests (preferred for `domain` + `application`). |

## MongoDB

- Env vars: `MONGO_USER`, `MONGO_PASSWORD`, `SPRING_DATA_MONGODB_URI` (see `application.properties`).
- Docker host `mongodb`, port `27017`, database `meubanco`, auth DB `admin`.
- Smoke test `BackApplicationTests.contextLoads()` needs MongoDB running.
