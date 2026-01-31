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