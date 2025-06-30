<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, nextTick, onBeforeUnmount } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  lat: number
  lng: number
  enableClick?: boolean
}>()

const emit = defineEmits<{
  (e: 'mapClick', payload: { lat: number; lng: number }): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map
let marker: L.Marker

const clickHandler = (e: L.LeafletMouseEvent) => {
  const { lat, lng } = e.latlng
  marker.setLatLng([lat, lng])
  emit('mapClick', { lat, lng })
}

onMounted(async () => {
  await nextTick() // 確保 DOM 已渲染
  if (!mapContainer.value) return

  // 初始化地圖
  map = L.map(mapContainer.value, { attributionControl: false }).setView([props.lat, props.lng], 13)

  // 加入圖磚
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // 加入標記
  marker = L.marker([props.lat, props.lng]).addTo(map)

  // 初次根據 props.enableClick 綁定事件
  if (props.enableClick) {
    map.on('click', clickHandler)
  }
})

// 監控 props.lat/lng，更新位置
watch(() => [props.lat, props.lng], ([lat, lng]) => {
  if (map && marker) {
    map.setView([lat, lng], map.getZoom())
    marker.setLatLng([lat, lng])
  }
})

// 監控 props.enableClick，動態加/移除 click handler
watch(() => props.enableClick, (enabled) => {
  if (!map) return
  if (enabled) {
    map.on('click', clickHandler)
  } else {
    map.off('click', clickHandler)
  }
})

// 清理地圖資源
onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
