<template>
  <div v-if="visible" class="dialog-overlay">
    <div class="dialog-container">
      <!-- 可選標題區 -->
      <slot name="title">
        <h3 class="dialog-default-title">{{ title }}</h3>
      </slot>

      <!-- 表單或自定內容 -->
      <div class="dialog-content">
        <slot />
      </div>

      <!-- 動作按鈕 -->
      <div class="dialog-actions">
        <button class="dialog-button confirm" @click="onConfirm">{{ confirmText }}</button>
        <button v-if="showCancel" class="dialog-button cancel" @click="onCancel">
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
  title: {
    type: String,
    default: '',
  },
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
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.dialog-default-title {
  font-size: 1.25rem;
  margin-bottom: 8px;
  text-align: center;
}

.dialog-content {
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
