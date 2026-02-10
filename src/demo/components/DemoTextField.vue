<template>
  <v-card variant="outlined" class="pa-4">
    <div class="text-subtitle-2 text-medium-emphasis mb-2">Text</div>
    <v-text-field
      :model-value="store.text"
      placeholder="Type something..."
      hide-details
      density="compact"
      @update:model-value="onTextChange"
    />
  </v-card>
</template>

<script setup lang="ts">
import { useDemoStore } from '../demoStore';
import { updateDemoState } from '../demoSync';

const store = useDemoStore();

function onTextChange(value: string) {
  updateDemoState({ text: value });
}
</script>
