<template>
  <nav class="tab-bar">
    <button @click="go('/story')" :class="{ active: isActive('/story') }">
      <i class="fas fa-book-open"></i>
    </button>
    <button @click="go('/note')" :class="{ active: isActive('/note') }">
      <i class="fas fa-pen"></i>
    </button>
    <button @click="go('/chat')" :class="{ active: isActive('/chat') }">
      <i class="fas fa-comments"></i>
    </button>
    <button>
      <i class="fas fa-cog"></i>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const go = (path: string) => {
  if (route.path !== path) {
    router.push(path);
  }
};

const isActive = (path: string) => route.path === path;
</script>

<style scoped lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3.2rem;
  background-color: var(--color-accent);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #ccc;
}

button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--color-primary);
  cursor: pointer;
}

button.active {
  color: var(--color-text);
}
</style>