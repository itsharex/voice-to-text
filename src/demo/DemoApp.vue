<template>
  <v-app>
    <v-main>
      <v-container class="pa-4" fluid>
        <div class="text-h6 mb-1 d-flex align-center justify-space-between">
          <span>{{ windowLabel }}</span>
          <DemoStatusBar />
        </div>

        <v-divider class="mb-3" />

        <DemoAutoPlay class="mb-3" />
        <DemoCounter class="mb-3" />
        <DemoColorPicker class="mb-3" />
        <DemoSlider class="mb-3" />
        <DemoTextField />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useDemoStore } from './demoStore';
import { createDemoSync } from './demoSync';
import DemoAutoPlay from './components/DemoAutoPlay.vue';
import DemoCounter from './components/DemoCounter.vue';
import DemoColorPicker from './components/DemoColorPicker.vue';
import DemoSlider from './components/DemoSlider.vue';
import DemoTextField from './components/DemoTextField.vue';
import DemoStatusBar from './components/DemoStatusBar.vue';

const store = useDemoStore();
const sync = createDemoSync(store);

const LABELS: Record<string, string> = {
  'demo-a': 'Window A',
  'demo-b': 'Window B',
  'demo-c': 'Window C',
};
const windowLabel = ref('');

onMounted(async () => {
  const win = getCurrentWindow();
  windowLabel.value = LABELS[win.label] ?? win.label;
  await sync.start();
});

onUnmounted(() => {
  sync.stop();
});
</script>
