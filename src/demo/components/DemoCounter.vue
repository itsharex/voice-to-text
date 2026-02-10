<template>
  <v-card variant="outlined" class="pa-4">
    <div class="text-subtitle-2 text-medium-emphasis mb-2">Counter</div>
    <div class="d-flex align-center justify-space-between">
      <v-btn icon size="small" @click="decrement">
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <span class="text-h3 font-weight-bold mx-4">{{ store.counter }}</span>

      <v-btn icon size="small" @click="increment">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useDemoStore } from '../demoStore';
import { updateDemoState } from '../demoSync';

const store = useDemoStore();

function increment() {
  updateDemoState({ counter: store.counter + 1 });
}

function decrement() {
  updateDemoState({ counter: store.counter - 1 });
}
</script>
