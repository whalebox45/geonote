<template>
  <div class="map-view" :id="mapId"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import L from 'leaflet';

type MarkerData = {
  title: string;
  location: {
    lat: number;
    lng: number;
  };
};

const props = defineProps<{
  lat: number;
  lon: number;
  enableClick: boolean;
  markers?: MarkerData[];
}>();

const mapId = `map-${Math.random().toString(36).slice(2)}`;
let map: L.Map;
let markerGroup: L.LayerGroup;

const initializeMap = () => {
  map = L.map(mapId).setView([props.lat, props.lon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  markerGroup = L.layerGroup().addTo(map);

  if (props.enableClick) {
    map.on('click', (e: L.LeafletMouseEvent) => {
      console.log('Clicked at:', e.latlng);
    });
  }

  if (props.markers && props.markers.length > 0) {
    updateMarkers(props.markers);
  }
};

const updateMarkers = (markers: MarkerData[]) => {
  markerGroup.clearLayers();

  markers.forEach(mem => {
    if (!mem.location) return;
    const marker = L.marker([mem.location.lat, mem.location.lng])
      .bindPopup(mem.title);
    markerGroup.addLayer(marker);
  });

  // 自動聚焦範圍
  const bounds = L.latLngBounds(markers.map(m => [m.location.lat, m.location.lng]));
  map.fitBounds(bounds, { padding: [20, 20] });
};

onMounted(() => {
  initializeMap();
});

watch(() => props.markers, (newMarkers) => {
  if (map && newMarkers && newMarkers.length > 0) {
    updateMarkers(newMarkers);
  }
}, { deep: true });
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}
</style>
