# GeoNote Frontend

GeoNote 是一款以 **記憶地點與感受記錄** 為主題的前端專案，採用手機優先設計，使用 Vue 3 + Vite + TypeScript 建構，搭配 Sass 與 OpenStreetMap。

目前階段：**純前端樣式建置，尚無功能，著重於畫面與結構清晰。**

---

## 🚀 技術架構

- **Vue 3 + Vite + TypeScript**
- **vue-router**：頁面切換
- **Sass / SCSS**：可變數管理樣式
- **Font Awesome**：圖示
- **vue3-openlayers**：顯示 OSM 地圖
- **手機優先設計**：320×568 起跳

---

## 📦 安裝與啟動

```bash
npm install
npm run dev
```

瀏覽器開啟：`http://localhost:5173`

---

## 📁 專案結構

```
src/
├── main.ts                  # 程式進入點
├── App.vue                  # 掛載 Transition + router-view
├── router.ts                # 路由設定
├── styles/
│   └── global.scss          # reset + 全域變數 +字體 + icon
├── components/
│   ├── TabBar.vue           # 底部導覽列
│   └── MapView.vue          # OpenStreetMap 組件
└── views/
    ├── LoginView.vue        # 登入畫面
    ├── HomeView.vue        # 地圖 + 記憶卡片
    ├── NoteView.vue         # 記憶建立
    └── ChatView.vue         # 聊天畫面
```

---

## 🌈 全域樣式與字體

- 字體：`Source Serif Pro`
- 使用 CSS 變數設定主色系（可集中管理）

```scss
:root {
  --color-bg: #d4e1d1;
  --color-primary: #3b5b4f;
  --color-accent: #f4f1ea;
  --color-text: #222;
}
```

---

## 🌍 地圖顯示

使用 [`vue3-openlayers`](https://github.com/MelihAltintas/vue3-openlayers)，目前僅提供可移動、可縮放的 OpenStreetMap，未包含 pin 或互動功能。

---

## 🧩 頁面與路由

| 路徑        | 頁面       | 說明                           |
|-------------|------------|--------------------------------|
| `/`         | Login      | 輸入帳密，點擊進入主頁         |
| `/home `    | Home       | 顯示地圖 + 記憶卡片（雙欄）    |
| `/note`     | Note       | 建立記憶，包含 mood、時間、描述、圖片 |
| `/chat`     | Chat       | 對話式介面，輸入訊息無功能     |

---

## 🎬 頁面轉場

使用 `<Transition name="fade">` 包住 `router-view`，實現淡入淡出動畫效果。

---

## 📱 設計方向

- 針對手機（320px 寬）優化，不處理寬螢幕與桌面版本
- 所有畫面為靜態排版，暫不具備資料與互動功能
- 使用 SCSS 模組化，每頁樣式內聚、易於維護

---

## 🔮 下一步建議（可選）

- 串接後端 API
- 實作圖片上傳（預覽、轉 base64 或 multipart）
- 地圖點選後填入經緯度
- 使用者登入、Token 控管
- 多語言支援與主題切換

---

GeoNote Frontend - made with ❤️ by Kei
