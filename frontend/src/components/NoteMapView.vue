<template>
  <div id="map" class="map"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  lat: number;
  lng: number;
  enableClick?: boolean;
}>();

const emit = defineEmits<{
  (e: 'mapClick', payload: { lat: number; lng: number }): void;
}>();

let map: L.Map;
let marker: L.Marker;

onMounted(() => {
  // 初始化地圖
  map = L.map('map', { attributionControl: false }).setView([props.lat, props.lng], 13);

  // 圖磚層
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 初始 marker
  marker = L.marker([props.lat, props.lng]).addTo(map);

  // 點擊事件
  if (props.enableClick) {
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]); // 更新 marker
      emit('mapClick', { lat, lng }); // 傳給父層
    });
  }
});

// 當 props 改變時，自動更新地圖與 marker
watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  if (map && marker) {
    map.setView([newLat, newLng], map.getZoom());
    marker.setLatLng([newLat, newLng]);
  }
});
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
