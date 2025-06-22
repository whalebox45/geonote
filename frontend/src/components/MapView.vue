<template>
    <ol-map
      ref="mapRef"
      class="map"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      @mounted="onMapMounted"
    >
      <ol-view
        ref="viewRef"
        :center="[props.lon, props.lat]"
        :zoom="13"
        :projection="'EPSG:4326'"
      />
  
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
  
      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature>
            <ol-geom-point :coordinates="[props.lon, props.lat]" />
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
    </ol-map>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
    lat: number;
    lon: number;
  }>();
  

  const mapRef = ref<any>(null);
  const viewRef = ref<any>(null);
  
  function onMapMounted() {
    const map = mapRef.value?.mapObject;
  }
  
  watch(() => [props.lat, props.lon], ([newLat, newLon]) => {
    if (viewRef.value?.setCenter) {
      viewRef.value.setCenter([newLon, newLat]);
    }
  });
  </script>
  
  <style scoped>
  .map {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
  </style>
  