# Hop-In Backend 🚗

A scalable backend for a ride booking platform built using **Node.js**, **Express.js**, **MongoDB**, **Redis**, and **BullMQ**. The application supports ride management, seat booking, payments, refunds, and background job processing.

---

## Features

- JWT Authentication
- Role-based Authorization (Driver & Passenger)
- Ride Creation and Search
- Seat Booking with Seat Hold Mechanism
- Razorpay Payment Integration
- Refund Processing using BullMQ
- Redis-backed Queue
- MongoDB Transactions
- Docker Support
- Health Check Endpoint
- Graceful Shutdown

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- BullMQ
- JWT
- Razorpay
- Docker

---

## Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
PORT=3000

MONGODB_URI=

JWT_SECRET=

REDIS_HOST=

REDIS_PORT=

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=

WEBHOOK_SECRET=
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/satyamJ47/hop-in.git
```

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## Running Locally (Development)

### Prerequisites

Before starting the application, ensure the following services are running:

- MongoDB
- Redis

### Start the API Server

```bash
npm run dev
```

### Start Background Workers

Open a new terminal and run:

```bash
node workers/worker.js
```

> **Note:** The API server and the background worker run as separate Node.js processes. Both must be running for all features (such as refund processing and scheduled jobs) to work correctly during local development.

---

## Running with Docker

Build and start all services:

```bash
docker compose up --build
```

Run containers in detached mode:

```bash
docker compose up -d
```

Stop all running containers:

```bash
docker compose down
```

> Docker Compose starts the backend and Redis in isolated containers. If you're using MongoDB Atlas, no local MongoDB container is required.

---

## Health Check

Endpoint:

```http
GET /health
```

Example Response:

```json
{
  "status": "UP",
  "service": "hop-in-api",
  "timestamp": "2026-07-19T12:00:00.000Z"
}
```

---

## Authentication

Protected routes require a valid JWT access token.

Example request header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## API Modules

- Driver
- Passenger
- Vehicle
- Ride
- Payment

---

## Production Readiness

- Dockerized application
- Health Check Endpoint
- Graceful Shutdown
- Helmet Security Headers
- CORS Configuration
- Environment-based Configuration
- Background Workers using BullMQ
- Redis-backed Queue

---

## Future Improvements

- Refresh Token Authentication
- Google OAuth Login
- Swagger API Documentation
- Unit & Integration Tests
- CI/CD Pipeline
- Frontend Application

---

## Author

**Satyajit Jagadale**