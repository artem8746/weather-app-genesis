# ☁️ Weather Subscription API

A backend API built with **NestJS** that allows users to:

- 🔍 Get current weather for a city
- 📬 Subscribe to weather updates (hourly or daily)
- ✅ Confirm subscription via email
- ❌ Unsubscribe via secure tokenized link
- 🕒 Receive forecasts automatically via scheduled jobs

---

## 🚀 Tech Stack

- **NestJS** (TypeScript)
- **Prisma** ORM
- **PostgreSQL** (Dockerized)
- **SendGrid** (Email delivery)
- **@nestjs/schedule** (for cron jobs)
- **Swagger UI** (for API docs)

---

## 📂 API Endpoints

| Method | Endpoint                   | Description                           |
| ------ | -------------------------- | ------------------------------------- |
| GET    | `/api/weather?city=London` | Get current weather for a city        |
| POST   | `/api/subscribe`           | Subscribe an email to weather updates |
| GET    | `/api/confirm/:token`      | Confirm email subscription            |
| GET    | `/api/unsubscribe/:token`  | Unsubscribe from weather updates      |

---

## ▶️ How to Run the App

### 🐳 Option 1: Run with Docker Compose (Recommended)

Make sure you have **Docker** and **Docker Compose** installed.

```bash
# Clone the repository and enter the directory
git clone https://github.com/artem8746/weather-app-genesis.git
cd weather-app-genesis

# Create .env file and fill in credentials
cp .env.example .env

# Build and start the containers
docker-compose up --build

# Navigate to http://localhost:3100/swagger
```

## 🚀 Deployment

The API is deployed and available at:

🌍 **[https://weather-app-genesis.onrender.com/](https://weather-app-genesis.onrender.com/)**

You can access:

- **Base URL**: `https://weather-app-genesis.onrender.com/`
- **Swagger Docs**: `https://weather-app-genesis.onrender.com/swagger`
