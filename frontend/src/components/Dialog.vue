<template>
    <div v-if="visible" class="dialog-overlay">
      <div class="dialog-container">
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-actions">
          <button class="dialog-button confirm" @click="onConfirm">{{ confirmText }}</button>
          <button
            v-if="showCancel"
            class="dialog-button cancel"
            @click="onCancel"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  defineProps({
    visible: Boolean,
    message: String,
    showCancel: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: 'OK',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
  });
  
  const emit = defineEmits(['confirm', 'cancel']);
  
  function onConfirm() {
    emit('confirm');
  }
  
  function onCancel() {
    emit('cancel');
  }
  </script>
  
  <style scoped>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(3px);
    z-index: 9999;
  }
  
  .dialog-container {
    background: var(--color-bg);
    color: var(--color-text);
    padding: 2rem;
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  
  .dialog-message {
    margin-bottom: 24px;
    font-size: 16px;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
  }
  
  .dialog-button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .dialog-button.confirm {
    background-color: var(--color-primary);
    color: white;
  }
  
  .dialog-button.cancel {
    background-color: var(--color-accent);
    color: var(--color-text);
  }
  </style>
  