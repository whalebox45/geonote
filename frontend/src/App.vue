<template>
  <div class="app">
    <Transition name="fade" mode="out-in">
      <router-view />
    </Transition>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
