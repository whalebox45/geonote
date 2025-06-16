GeoNote Backend

GeoNote 是一個結合地圖、記憶、情緒與圖片的個人潛意識剪輯系統。本資料夾為其後端專案，使用 Node.js + Express + MongoDB，搭配 Docker 快速部署。

📦 技術棨

Node.js + Express

MongoDB + Mongoose

RESTful API

Multer 圖片上傳（本地端儲存）

UUID 記憶 ID

Dev Token 模擬登入（可選）

Docker / docker-compose 一鍵啟動

🚀 快速開始

1️⃣ 下載專案

git clone https://github.com/your-username/geonote.git
cd geonote/backend

2️⃣ 建立 .env

# backend/.env
MONGO_URI=mongodb://localhost:27017/geonote

若使用 Docker Compose，會自動使用 mongodb://mongo:27017/geonote

3️⃣ 啟動專案（本地）

安裝依賴

npm install

啟動服務

npm run dev

4️⃣ 啟動專案（使用 Docker）

docker-compose up --build

啟動後：

API → http://localhost:3000/api

MongoDB → 透過 GUI 工具（如 Compass）連線 localhost:27017

圖片資料夾 → backend/uploads/

🧪 測試 API

使用 VSCode REST Client 插件，開啟 tests/test.http，點選 ▶ Send Request 即可。

支援：

使用者建立 / 編輯 / 刪除

記憶 CRUD（含圖片上傳）

Dev Token 模擬身分驗證（可選）

📁 專案結構

backend/
├── models/           # Mongoose 資料模型
├── routes/           # API 路由：users, memories, upload
├── middleware/       # Dev token 模擬登入
├── uploads/          # 上傳圖片暫存
├── tests/            # REST Client 測試檔
├── index.js          # 主伺服器
├── Dockerfile        # Express 容器建置
├── docker-compose.yml
├── .env              # MongoDB URI
└── .dockerignore

🧐 Dev Token 模擬登入（可選）

在請求 header 中加入：

Authorization: Bearer devtoken123

即可繞過登入驗證，作為測試帳戶傳入 req.user = { uuid: 'test-user-uuid' }。

✅ 進度狀態
- 使用者與記憶 CRUD
- 本地圖片上傳
- MongoDB 容器化
- REST Client 測試
- 真實登入認證（未實作）
- LLM 整合（未實作）
- 前端（Vue）建置（進行中）


📬 聯繫與作者

作者：whale 願這個世界留下屬於你的記憶。

