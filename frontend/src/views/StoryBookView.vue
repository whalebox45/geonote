<template>
    <div class="mobile-page-base">
      <div class="container">
        <h2 class="section-title">{{ t("StoryBookView.section_title") }}</h2>
  
        <div class="memory-list">
          <template v-if="memories.length > 0">
            <div
              v-for="memory in memories"
              :key="memory.uuid"
              class="memory-entry"
            >
              <div class="memory-header">
                <h3 class="memory-title"><a :href="'#/note/read/' + memory.uuid">{{ memory.title }}</a></h3>
                <span class="memory-time">{{ formatDate(memory.occurredAt) }}</span>
              </div>
              <p class="memory-desc">{{ memory.description }}</p>
            </div>
          </template>
          <div v-else class="memory-placeholder">
            {{ t("StoryBookView.empty") }}
          </div>
        </div>
  
        <!-- 分頁控制 -->
        <div class="pagination">
          <button @click="prevPage" :disabled="page === 0" class="page-button">❮</button>
          <span class="page-info">{{ page + 1 }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="page + 1 >= totalPages" class="page-button">❯</button>
        </div>
      </div>
  
      <div style="height: 50px;"></div>
      <TabBar />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import TabBar from '../components/TabBar.vue'
  
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  interface Memory {
    uuid: string
    title: string
    description: string
    occurredAt: string
  }
  
  const memories = ref<Memory[]>([])
  const page = ref(0)
  const totalPages = ref(1)
  
  const fetchMemories = async () => {
    const API_URL = import.meta.env.VITE_API_URL
  
    try {
      const response = await axios.get(`${API_URL}/memories/me`, {
        params: { page: page.value },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      memories.value = response.data.memories
      totalPages.value = response.data.totalPages
    } catch (err) {
      console.error('Failed to load memories:', err)
    }
  }
  
  const nextPage = () => {
    if (page.value + 1 < totalPages.value) {
      page.value++
      fetchMemories()
    }
  }
  
  const prevPage = () => {
    if (page.value > 0) {
      page.value--
      fetchMemories()
    }
  }
  
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString()
  }
  
  onMounted(fetchMemories)
  </script>
  
  <style scoped lang="scss">
  
  .section-title {
    font-size: 32px;
    margin-bottom: 16px;
  }
  
  /* 記憶列表為直列全寬 */
  .memory-list {
    display: flex;
    flex-direction: column;
  }
  
  /* 每筆記憶條目 */
  .memory-entry {
    padding: 16px 0;
    border-bottom: 1px solid #aaa;
  }
  
  /* 標題與時間並排 */
  .memory-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 6px;
  }
  
  .memory-title {
    font-size: 20px;
    font-weight: bold;
  }
  
  .memory-time {
    font-size: 0.875rem;
    color: var(--color-secondary);
  }
  
  .memory-desc {
  font-size: 1rem;
  color: var(--color-text);
  white-space: pre-wrap;
  line-height: 1.5rem;
  min-height: 7.5rem; /* 1.5 * 5 行 */
  overflow: hidden;
}
  
  .memory-placeholder {
    text-align: center;
    color: var(--color-secondary);
    font-style: italic;
    padding: 16px;
  }
  
  /* 分頁樣式 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    gap: 1rem;
  }
  
  .page-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--color-primary);
  
    &:disabled {
      color: var(--color-disabled);
      cursor: default;
    }
  }
  
  .page-info {
    font-size: 14px;
    color: var(--color-primary);
  }
  </style>
  