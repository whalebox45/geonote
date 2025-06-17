<!-- src/components/MapView.vue -->
<template>
    <ol-map class="map" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true">
        <ol-view :center="[121.5645, 25.0339]" :zoom="13" :projection="'EPSG:4326'" />
        <ol-tile-layer>
            <ol-source-osm />
        </ol-tile-layer>
    </ol-map>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.map {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
}
</style>