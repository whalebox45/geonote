<template>
  <div class="story-page">
    <div class="story-container">
      <h2 class="section-title">Story</h2>

      <div class="map-placeholder">
        <MapView :lat="25.0339" :lon="121.5645" :enableClick="false" />

      </div>


      <h3 class="recent-title">Recent Memories</h3>
      <div class="memory-list">
        <div class="memory-card">First meeting<br /><span class="time">2 days ago</span></div>
        <div class="memory-card">Evening Walk<br /><span class="time">5 days ago</span></div>
        <div class="memory-card">Museum Visit<br /><span class="time">1 week ago</span></div>
        <div class="memory-card">Another<br /><span class="time">Just now</span></div>
      </div>
    </div>

    <div style="height: 50px;"></div>

    <TabBar />
  </div>
</template>

<script setup lang="ts">
import TabBar from '../components/TabBar.vue';
import MapView from '../components/MapView.vue';
</script>

<style scoped lang="scss">
.story-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--color-bg);
}

.story-container {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}


.map-placeholder {
  height: 70vh;
  background-color: #c0d6c3;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
}

.recent-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
}

.memory-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.memory-card {
  background-color: var(--color-accent);
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start; // 🟢 上對齊
}

.memory-card>*:not(:last-child) {
  margin-bottom: 0.25rem;
}

.time {
  font-size: 0.75rem;
  color: #666;
}
</style>
