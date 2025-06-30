<template>
    <div class="profile-page">
      <div class="profile-container">
        <h2 class="section-title">Profile & Settings</h2>
      </div>
  
      <div style="height: 50px;"></div>
      <TabBar />
    </div>
  </template>
  
  <script setup lang="ts">
  import TabBar from '../components/TabBar.vue'
  </script>
  
  <style scoped lang="scss">
  .profile-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--color-bg);
  }
  
  .profile-container {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
  }
  
  .section-title {
    font-size: 32px;
    color: var(--color-text);
    margin-bottom: 16px;
  }
  </style>
  