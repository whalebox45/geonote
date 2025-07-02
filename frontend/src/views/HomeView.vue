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
            <a :href="'#/note/read/' + memory.uuid" class="memory-title">
              {{ memory.title }}
            </a>
            <br />
            <span class="time">{{ formatTimeAgo(memory.occurredAt) }}</span>
          </div>
        </template>
        <div v-else class="memory-placeholder">
          No memories yet.
        </div>
      </div>
      
      <div class="row">
        <button class="see-more-button" @click="go('/storybook')">See All</button>
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
import { formatTimeAgo } from '../utils/datetimeConvert';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter();
const route = useRoute();

const uuid = route.params.uuid as string | undefined
const isReadOnly = ref(false)

const go = (path: string) => {
  if (route.path !== path) {
    router.push(path);
  }
};

type Memory = {
  _id: string;
  uuid: string;
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



type MarkerData = {
  title: string;
  location: { lat: number; lng: number };
};

const recentMemoriesWithLocation = computed<MarkerData[]>(() =>
  recentMemories.value
    .filter(m => m.location?.lat != null && m.location?.lng != null)
    .map(m => ({
      title: m.title,
      location: {
        lat: m.location!.lat,
        lng: m.location!.lng
      }
    }))
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

.section-title {
  font-size: 32px;
}

.home-container {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.map-placeholder {
  height: 50vh;
  background-color: #c0d6c3;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
}

.recent-title {
  font-size: 24px;
  margin-bottom: 8px;
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
  font-size: 16px;
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
  padding: 16px;
}

.time {
  font-size: 0.75rem;
  color: #666;
}

.see-more-button {
  margin-top: 16px;
  padding: 0.8rem;
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Source Serif Pro', serif;

  &:hover {
    opacity: 0.9;
  }
}
</style>
