<template>
  <div class="home-page">
    <div class="home-container">
      <h2 class="section-title">Home</h2>

      <div class="map-placeholder">
        <MapView
          :lat="25.0339"
          :lon="121.5645"
          :enableClick="false"
          :markers="recentMemoriesWithLocation"
        />
      </div>

      <h3 class="recent-title">Recent Memories</h3>
      <div class="memory-list">
        <template v-if="recentMemories.length > 0">
          <div
            v-for="memory in recentMemories"
            :key="memory._id"
            class="memory-card"
          >
            {{ memory.title }}<br />
            <span class="time">{{ formatTimeAgo(memory.occurredAt) }}</span>
          </div>
        </template>
        <div v-else class="memory-placeholder">
          No memories yet.
        </div>
      </div>
    </div>

    <div style="height: 50px;"></div>
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import TabBar from '../components/TabBar.vue';
import MapView from '../components/MapView.vue';

type Memory = {
  _id: string;
  title: string;
  occurredAt: string;
  location?: {
    lat: number;
    lng: number;
  };
};

const recentMemories = ref<Memory[]>([]);

async function getRecent10Memories() {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const res = await fetch(`${API_URL}/memories/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch recent memories');
    }

    const result = await res.json();
    recentMemories.value = result.memories ?? result; // 根據後端實際格式調整
  } catch (error) {
    console.error('Error fetching recent memories:', error);
  }
}

function formatTimeAgo(isoDate: string): string {
  const now = new Date();
  const then = new Date(isoDate);
  const diff = (now.getTime() - then.getTime()) / 1000;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 604800)} weeks ago`;
}

const recentMemoriesWithLocation = computed(() =>
  recentMemories.value.filter(m => m.location?.lat != null && m.location?.lng != null)
);

onMounted(getRecent10Memories);
</script>

<style scoped lang="scss">
.home-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--color-bg);
}

.home-container {
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
  justify-content: flex-start;
}

.memory-card > *:not(:last-child) {
  margin-bottom: 0.25rem;
}

.memory-placeholder {
  grid-column: span 2;
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 1rem;
}

.time {
  font-size: 0.75rem;
  color: #666;
}
</style>
