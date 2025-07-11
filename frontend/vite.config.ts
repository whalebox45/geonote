import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 允許最多 5MB
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ttf,eot,woff}']
    },
    manifest: {
      name: 'GeoNote',
      short_name: 'GeoNote',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4CAF50', // 你選的綠色主題
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })

  ],
  server: {
    host: '0.0.0.0',   // ✅ 接受任何來源（不是只限 localhost）
    port: 5173         // ❓ 可自訂你要的 port（預設 5173）
  }
})
