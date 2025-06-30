<template>
  <nav class="tab-bar">
    <button @click="go('/home')" :class="{ active: isActive('/home') }">
      <i class="fas fa-home"></i>
    </button>
    <button @click="go('/storybook')" :class="{ active: isActive('/home') }">
      <i class="fas fa-book"></i>
    </button>
    <button @click="go('/note/new')" :class="{ active: isActive('/note') }">
      <i class="fas fa-pen"></i>
    </button>
    <button @click="go('/chat')" :class="{ active: isActive('/chat') }">
      <i class="fas fa-comments"></i>
    </button>
    <button @click="go('/')">
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
  background-color: var(--color-primary);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #ccc;
  z-index: 1000;
}

button {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--color-bg);
  cursor: pointer;
}

button.active {
  color: var(--color-accent);
}
</style>