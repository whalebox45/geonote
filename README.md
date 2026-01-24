# GeoNote 前端專案

GeoNote 是一款以「記憶地圖」為核心的個人筆記系統。使用者可記錄與地點相關的回憶、感受與事件，並以地圖視覺化方式呈現。此前端專案為 PWA（漸進式網頁應用），支援深色／淺色主題切換。

目前已達 MVP 階段，支援：
- 使用者註冊、登入（JWT 認證）
- 記憶（Note）建立、瀏覽、編輯、刪除
- 分頁瀏覽記憶列表
- 地圖顯示功能（OpenStreetMap）
- 手機優先介面設計

---

## 🔧 技術架構

- Vite + Vue 3 + TypeScript
- vue-router（路由）
- Pinia（狀態管理，若你已採用）
- Sass / SCSS（樣式）
- Font Awesome（icon）
- vue3-openlayers（地圖）
- JWT 驗證串接後端 API

---

## 📦 安裝與啟動

```bash
npm install
npm run dev
```

預設伺服器位置：http://localhost:5173

## 專案結構（精簡）

```
src/
├── assets/               # 靜態資源
├── components/           # 可重用元件
├── router/               # vue-router 設定
├── views/                # 各頁面元件
├── styles/               # 全域樣式
├── stores/               # Pinia 狀態（如有）
├── services/             # API 呼叫模組
├── App.vue
└── main.ts
```

##  環境設定

請建立 .env 檔案並設定 API 伺服器位置，例如：

VITE_API_BASE=http://localhost:3000/api

## MIT License

```
MIT License

Copyright (c) 2025 whalebox4.5@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

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

MIT © Whalebox45


Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

GeoNote is an experimental personal spatial journaling tool. Feel free to fork or build on top.
