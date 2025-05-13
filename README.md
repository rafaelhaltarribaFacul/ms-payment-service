# ms-payment-service

Microsserviço de pagamento em Nest.js + Prisma que persiste dados de pagamento e publica eventos RabbitMQ.

## 📋 Pré-requisitos

- **Node.js** v16 ou superior  
- **npm** (vem com o Node.js)  
- **Docker** & **Docker Compose**  
- (Opcional) **PgAdmin** para inspeção do banco  

## ⚙️ Variáveis de ambiente

Na raiz do projeto, crie um arquivo `.env` com:

    # conexão Postgres
    DATABASE_URL=postgresql://postgres:root@127.0.0.1:5432/payment?schema=public

    # conexão RabbitMQ
    RABBITMQ_URL=amqp://admin:123456@127.0.0.1:5672

Importante: não use aspas e não inclua espaços extras.

## 🐳 Containers necessários

### PostgreSQL + PgAdmin

    docker compose -f docker/docker-postgres.yml up -d

Banco em `localhost:5432`, PgAdmin em `localhost:15432` (usuário `postgres` / `root`).

### RabbitMQ

    docker compose -f docker/docker-rabbit.yml up -d

Broker em `localhost:5672`, console de gestão em `localhost:15672` (usuário `admin` / `123456`).

## 💾 Instalação e setup do Prisma

    npm install
    npx prisma db push      # sincroniza schema.prisma com o banco
    npx prisma generate     # gera o Prisma Client

## 🚀 Rodando em modo desenvolvimento

    npm run start:dev

O servidor ficará disponível em http://localhost:3000.

## 🔗 Endpoints disponíveis

### GET /

Retorna status do serviço:

    curl http://localhost:3000/
    # running server

### POST /credit-card/send

Cria um registro de pagamento e emite eventos para RabbitMQ:

- **URL:** `http://localhost:3000/credit-card/send`  
- **Método:** `POST`  
- **Headers:** `Content-Type: application/json`  
- **Body de exemplo:**
    
        {
          "idUser": "10",
          "orderNumber": 123,
          "orderValue": 456.78
        }

- **Exemplo de curl:**

        curl -X POST http://localhost:3000/credit-card/send \
          -H "Content-Type: application/json" \
          -d '{"idUser":"10","orderNumber":123,"orderValue":456.78}'

- **Resposta de exemplo:**

        {
          "id": "00bd222d-6ac8-4d4e-9eb2-7b2532b254f3",
          "idUser": "10",
          "orderNumber": 123,
          "orderValue": 456.78,
          "paymentConfirmed": false,
          "createdAt": "2025-05-13T19:28:39.270Z",
          "updatedAt": "2025-05-13T19:28:39.270Z"
        }

## 📝 Observações

Este serviço publica os eventos `register` (imediato) e `confirmation` (após 10s) na fila `notification`.

Para consumi-los, use o microsserviço de notificação (ms-notification-service) e chame o endpoint:

    curl "http://localhost:3001/mail/get?idUser=10"

Lembre-se de ter ambos os serviços (pagamento e notificação) rodando simultaneamente para testar o fluxo completo.
