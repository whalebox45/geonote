# TODO

## 🔴 待處理

- [x] 閱讀頁顯示 + 時區處理（`a4e5c9d`）：Mood emoji、Intensity 文字、日期用 `Intl.DateTimeFormat`；讀取時 UTC → 當地時間，儲存時送 `toISOString()`

- [ ] **舊資料的 `occurredAt` 差了 8 小時**
  - 原因：舊前端送出沒有時區的字串（例：`"2026-05-29T10:27"`），後端在 UTC 時區下執行，直接當成 UTC 存成 `10:27Z`；實際應該是台灣時間 10:27 = `02:27Z`
  - 現象：套用上面的修改後，舊筆記會顯示成晚 8 小時（例：淡江大橋 10:27 → 6:27 PM）
  - 處理方式（二選一）：
    - 寫一次性 migration：對修正前建立／編輯過的 memories，`occurredAt` 減 8 小時
    - 筆記不多的話，直接在編輯頁手動改回正確時間再存
  - 預防：後端 `validateMemoryFields` 要求 `occurredAt` 必須帶時區（結尾 `Z` 或 `±hh:mm`），不收沒有時區的字串

## 🔴 安全性（部署公開 demo 前要修）

- [ ] `GET /api/memories/:uuid` 沒有驗證，也沒有檢查擁有者：知道 uuid 就能讀任何人的筆記（前端 `fetchMemory` 也沒帶 token）
- [ ] `GET /api/accounts/by-uuid/:uuid` 沒有驗證，任何人都能用 user uuid 查到 email；而筆記的回應裡就帶著 `userUuid`，兩者串起來可以從一則筆記查到作者的 email
- [ ] `PATCH /api/users/:uuid` 直接把 `req.body` 寫進資料庫（mass assignment），本人可以改到 `isRevoked`、`uuid` 等不該開放的欄位 → 改成白名單（nickname、bio…）
- [ ] 上傳的圖片用 `?token=` 驗證，token 會留在網址與伺服器日誌裡 → 考慮改成短效簽名網址

## 🟡 Bug

- [ ] `POST /api/upload` 沒帶檔案時 `req.file` 是 `undefined`，`req.file.filename` 會讓後端噴 500 → 應回 400
- [ ] `frontend` 同時裝了 `vue3-openlayers` 並在 `main.ts` 註冊，但地圖實際上都用 Leaflet → 移除沒用到的套件，縮小 bundle
- [ ] `backend/uploads/` 清掉作品集截圖時留下的測試檔：`sakura-demo.png` 和 10 張 `17938646*.png`（OSM 地圖圖磚）

## 🟢 作品集／文件相關

- [ ] PWA 目前只 precache 靜態檔（`globPatterns`），**地圖圖磚與筆記 API 都沒有離線快取**
  - 若要宣稱「離線可用」，需在 `vite.config.ts` 的 workbox 加 `runtimeCaching`（圖磚用 CacheFirst、API 用 NetworkFirst）
  - 在那之前，作品集與 README 不要寫「離線存取」
- [ ] 部署一個公開 demo（作品集卡片可以加 Demo 按鈕）
