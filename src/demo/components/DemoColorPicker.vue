<template>
  <v-card variant="outlined" class="pa-4">
    <div class="text-subtitle-2 text-medium-emphasis mb-2">Color</div>

    <div class="d-flex ga-2 mb-3">
      <button
        v-for="c in colors"
        :key="c"
        class="color-circle"
        :class="{ 'color-circle--active': store.color === c }"
        :style="{ backgroundColor: c }"
        @click="selectColor(c)"
      />
    </div>

    <div
      class="color-preview rounded"
      :style="{ backgroundColor: store.color }"
    />
  </v-card>
</template>

<script setup lang="ts">
import { useDemoStore } from '../demoStore';
import { updateDemoState } from '../demoSync';

const store = useDemoStore();

const colors = [
  '#ef4444',
  '#f59e0b',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

function selectColor(c: string) {
  updateDemoState({ color: c });
}
</script>

<style scoped>
.color-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}

.color-circle:hover {
  transform: scale(1.1);
}

.color-circle--active {
  border-color: rgba(255, 255, 255, 0.8);
}

.color-preview {
  height: 24px;
  transition: background-color 0.2s;
}
</style>
