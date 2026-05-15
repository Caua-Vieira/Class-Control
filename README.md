# SmartTasks

API REST para gerenciamento de tarefas com autenticação JWT, notificações por e-mail e lembretes automáticos via fila de mensagens e jobs agendados.

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Endpoints da API](#endpoints-da-api)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rodando com Docker](#rodando-com-docker)
- [Rodando Localmente (sem Docker)](#rodando-localmente-sem-docker)
- [Rodando os Testes](#rodando-os-testes)
- [CI/CD](#cicd)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Sobre o Projeto

SmartTasks é uma API de gerenciamento de tarefas construída com foco em boas práticas de engenharia de software. O projeto demonstra o uso de **Clean Architecture**, **event-driven design**, **filas de mensagens** e **jobs agendados** em uma aplicação Node.js/TypeScript.

Ao criar uma tarefa, um evento é publicado no RabbitMQ, processado por um worker assíncrono que envia um e-mail de confirmação ao usuário. Um job agendado (cron) monitora continuamente as tarefas e envia lembretes automáticos 7 e 3 dias antes do vencimento.

---

## Arquitetura

O projeto segue os princípios de **Clean Architecture**, dividindo responsabilidades em camadas bem definidas:

```
src/
├── domain/          # Entidades, contratos (interfaces), DTOs e erros de negócio
├── application/     # Casos de uso (regras de negócio)
├── infrastructure/  # Implementações concretas: banco de dados, e-mail, filas, logs
├── interfaces/      # Controllers, rotas e servidor Express
├── middleware/      # Autenticação JWT e tratamento de erros
└── workers/         # Consumidores de fila RabbitMQ e cron jobs
```

**Fluxo de criação de tarefa:**

```
Request → Controller → UseCase → Repository (DB)
                                      ↓
                               RabbitMQ (publish)
                                      ↓
                              Worker (consume)
                                      ↓
                           Nodemailer (e-mail)
```

---

## Tecnologias

| Categoria              | Tecnologia                   |
|------------------------|------------------------------|
| Runtime                | Node.js                      |
| Linguagem              | TypeScript 5.x               |
| Framework Web          | Express.js 5.x               |
| Banco de Dados         | PostgreSQL                   |
| ORM                    | TypeORM                      |
| Autenticação           | JWT (jsonwebtoken) + bcrypt  |
| Fila de Mensagens      | RabbitMQ (amqplib)           |
| E-mail                 | Nodemailer                   |
| Jobs Agendados         | node-cron                    |
| Injeção de Dependência | typescript-ioc               |
| Logs                   | Pino                         |
| Testes                 | Jest + ts-jest               |
| Containerização        | Docker + Docker Compose      |
| CI/CD                  | GitHub Actions               |

---

## Funcionalidades

- **Autenticação** — Login com e-mail e senha, token JWT com validade de 24h
- **Gerenciamento de Tarefas** — CRUD completo com controle de status (`Pendente` / `Concluída`)
- **Notificação por E-mail** — E-mail automático ao criar uma nova tarefa (processado de forma assíncrona)
- **Lembretes Automáticos** — Job cron que envia lembretes 7 dias e 3 dias antes do vencimento da tarefa
- **Arquitetura Event-Driven** — Publicação e consumo de eventos via RabbitMQ
- **Tratamento de Erros Centralizado** — Exceções de domínio mapeadas para respostas HTTP padronizadas
- **Logs Estruturados** — Logging com Pino em todas as camadas da aplicação

---

## Endpoints da API

### Autenticação

| Método | Rota    | Descrição                        | Auth |
|--------|---------|----------------------------------|------|
| POST   | `/auth` | Login — retorna token JWT        | Não  |

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "suasenha"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Tarefas

Todos os endpoints de tarefas exigem o header:
```
Authorization: Bearer <token>
```

| Método | Rota                    | Descrição                         |
|--------|-------------------------|-----------------------------------|
| POST   | `/tasks`                | Cria uma nova tarefa              |
| GET    | `/tasks`                | Lista todas as tarefas pendentes  |
| PUT    | `/tasks/:id`            | Atualiza uma tarefa               |
| PUT    | `/tasks/:id/conclude`   | Marca uma tarefa como concluída   |
| DELETE | `/tasks/:id`            | Remove uma tarefa                 |

**Body (POST/PUT):**
```json
{
  "title": "Estudar TypeScript",
  "description": "Revisar generics e decorators",
  "dueDate": "2026-06-01T00:00:00.000Z"
}
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Servidor
PORT=3000

# Banco de Dados (PostgreSQL)
DB_USER=admin
DB_PASSWORD=sua_senha_aqui
DB_NAME=SmartTasks
DB_HOST=localhost
DB_PORT=5432

# Autenticação
JWT_SECRET=seu_segredo_jwt_aqui

# E-mail (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app_gmail
```

> **Dica para Gmail:** Utilize uma [Senha de App](https://support.google.com/accounts/answer/185833) em vez da senha principal da conta.

---

## Rodando com Docker

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### Passo a passo

**1. Clone o repositório:**
```bash
git clone https://github.com/Caua-Vieira/smart-tasks-management.git
cd smart-tasks-management
```

**2. Configure o `.env`** conforme a seção [Variáveis de Ambiente](#variáveis-de-ambiente).

**3. Suba os serviços de infraestrutura (PostgreSQL e RabbitMQ):**
```bash
docker-compose up -d
```

Isso iniciará:
- **PostgreSQL** na porta `5432`
- **RabbitMQ** na porta `5672` (AMQP) e `15672` (painel de gerenciamento)

**4. Instale as dependências:**
```bash
npm install
```

**5. Inicie os processos da aplicação em terminais separados:**

```bash
# Terminal 1 — API principal
npm run dev

# Terminal 2 — Worker de e-mail (processa tarefas criadas)
npm run start:worker

# Terminal 3 — Cron de lembretes (monitora vencimentos)
npm run start:cron
```

**Painel do RabbitMQ:** acesse `http://localhost:15672` com as credenciais `guest / guest`.

### Parando os serviços

```bash
docker-compose down
```

Para remover também os volumes (dados persistidos):
```bash
docker-compose down -v
```

---

## Rodando Localmente (sem Docker)

### Pré-requisitos

- Node.js 18+
- PostgreSQL instalado e rodando
- RabbitMQ instalado e rodando

**1.** Configure as variáveis de ambiente apontando para suas instâncias locais.

**2.** Instale as dependências:
```bash
npm install
```

**3.** Inicie os processos:
```bash
npm run dev        # API
npm run start:worker   # Worker de e-mail
npm run start:cron     # Cron de lembretes
```

---

## Rodando os Testes

O projeto utiliza **Jest** com **ts-jest** para testes unitários cobrindo casos de uso, controllers, middleware, workers e utilitários.

**Executar todos os testes:**
```bash
npm test
```

**Executar com relatório de cobertura:**
```bash
npm run test:coverage
```

O relatório de cobertura é gerado na pasta `coverage/` e inclui métricas de linhas, funções, branches e statements.

---

## CI/CD

O projeto possui um pipeline de **GitHub Actions** configurado em `.github/workflows/ci.yml` que executa automaticamente a cada push ou pull request nas branches `main` e `dev`.

**Etapas do pipeline:**

```
1. Checkout do código
2. Configurar Node.js 22
3. Instalar dependências (npm ci)
4. Executar testes com cobertura (npm run test:coverage)
5. Upload do relatório de cobertura como artefato (retenção de 7 dias)
```

---

## Estrutura do Projeto

```
SmartTasks/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── domain/
│   │   ├── contracts/
│   │   ├── entities/
│   │   ├── errors/
│   │   ├── events/
│   │   ├── mappers/
│   │   └── types/
│   ├── application/
│   │   └── usecases/
│   ├── infrastructure/
│   │   ├── config/
│   │   ├── database/
│   │   ├── email/
│   │   ├── messaging/
│   │   └── repositories/
│   ├── interfaces/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.ts
│   ├── middleware/
│   │   ├── auth-middleware.ts
│   │   └── error-handler.ts
│   ├── workers/
│   │   ├── task-created-worker.ts
│   │   └── task-reminder-worker.ts
│   ├── index.ts
│   └── task-reminder-cron.ts
├── tests/
├── docker-compose.yml
├── jest.config.js
├── tsconfig.json
├── tsconfig.test.json
└── package.json
```

---