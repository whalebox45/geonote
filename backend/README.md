
# GeoNote

**GeoNote** is a location-based memory journaling app that lets users record personal notes, emotions, and images tied to real-world places. Built as a mobile-first Progressive Web App (PWA), GeoNote emphasizes simplicity, privacy, and a sense of spatial reflection.

This repository covers both **Frontend (Vue 3 + Vite)** and **Backend (Node.js + Express + MongoDB)** components. The project is currently in MVP (Minimum Viable Product) stage.

---

## ✨ Features

- 🗺️ Map-based memory system using OpenStreetMap
- 🔐 JWT-based authentication with login/register flow
- 📝 CRUD operations for memories (notes), including image uploads
- 📄 Pagination support for memory list
- 📱 Mobile-first responsive design
- ⚙️ Docker support for easy deployment
- 🌙 Light/Dark theme switching
- 🧠 Designed for spatial emotional journaling

---

## 🛠️ Tech Stack

### Frontend

- Vue 3
- Vite
- TypeScript
- Vue Router
- SCSS / Sass
- Font Awesome
- vue3-openlayers (OpenStreetMap)
- PWA support

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer for image uploads
- RESTful API (JSON)
- Docker / Docker Compose

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Docker)
- (Optional) Docker & Docker Compose

---

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

`.env` example:

```env
MONGO_URI=mongodb://localhost:27017/geonote
JWT_SECRET=your_secret_key
PORT=3000
```

API will run at: `http://localhost:3000/api`

---

### 2. Docker (Optional)

```bash
docker compose -f backend/compose.yml up --build
```

This sets up both API server and MongoDB in containers.

---

## 🧪 API Overview

Base: `http://localhost:3000/api`

### Auth

- `POST /auth/register` — Create new user
- `POST /auth/login` — Returns JWT

### Memories

- `GET /memories/me?page=1` — Paginated memories of current user
- `POST /memories` — Create new memory
- `PUT /memories/:uuid` — Update memory
- `DELETE /memories/:uuid` — Delete memory
- `GET /memories/:uuid` — Fetch one memory

### Uploads

- `POST /upload` — Upload image (multipart/form-data)

> All memory-related endpoints require `Authorization: Bearer <token>` header.

---

## 🧩 Backend Structure

```
backend/
├── models/                 # Mongoose schemas
├── routes/                 # REST API routes
├── middleware/             # JWT auth middleware
├── uploads/                # Image storage
├── index.js / server.js    # Main entry point
├── Dockerfile
├── compose.yml
```

---

## 📃 License

MIT © Kei  


Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

GeoNote is an experimental personal spatial journaling tool. Feel free to fork or build on top.
