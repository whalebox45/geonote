import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',   // ✅ 接受任何來源（不是只限 localhost）
    port: 5173         // ❓ 可自訂你要的 port（預設 5173）
  }
})
