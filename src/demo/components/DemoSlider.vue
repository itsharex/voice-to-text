<template>
  <v-card variant="outlined" class="pa-4">
    <div class="d-flex align-center justify-space-between mb-1">
      <span class="text-subtitle-2 text-medium-emphasis">Slider</span>
      <span class="text-body-2 font-weight-bold">{{ store.sliderValue }}</span>
    </div>

    <v-slider
      :model-value="store.sliderValue"
      :min="0"
      :max="100"
      :step="1"
      hide-details
      @update:model-value="onSliderChange"
    />
  </v-card>
</template>

<script setup lang="ts">
import { useDemoStore } from '../demoStore';
import { updateDemoState } from '../demoSync';

const store = useDemoStore();

function onSliderChange(value: number) {
  updateDemoState({ sliderValue: value });
}
</script>
