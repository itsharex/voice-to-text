<template>
  <v-btn
    :color="running ? 'error' : 'success'"
    block
    size="large"
    @click="toggle"
  >
    <v-icon start>{{ running ? 'mdi-stop' : 'mdi-play' }}</v-icon>
    {{ running ? `STOP  (${phaseLabel})` : 'AUTO DEMO' }}
  </v-btn>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { updateDemoState } from '../demoSync';

const running = ref(false);
const phase = ref(0);

const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

const phaseLabels = ['Counter', 'Colors', 'Slider', 'Text', 'All'];
const phaseLabel = computed(() => phaseLabels[phase.value] ?? '');

let timer: ReturnType<typeof setInterval> | null = null;
let tick = 0;
let aborted = false;

function stop() {
  running.value = false;
  aborted = true;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function toggle() {
  if (running.value) {
    stop();
    return;
  }
  running.value = true;
  aborted = false;
  runSequence();
}

async function runSequence() {
  // Сброс состояния перед началом
  await updateDemoState({ counter: 0, color: COLORS[0], sliderValue: 50, text: '' });

  // Phase 0: Counter — быстрый инкремент
  phase.value = 0;
  tick = 0;
  await runPhase(50, 40, () => {
    tick++;
    updateDemoState({ counter: tick });
  });
  if (aborted) return;

  // Phase 1: Colors — быстрое переключение цветов
  phase.value = 1;
  tick = 0;
  await runPhase(80, 24, () => {
    updateDemoState({ color: COLORS[tick % COLORS.length] });
    tick++;
  });
  if (aborted) return;

  // Phase 2: Slider — плавное движение туда-обратно
  phase.value = 2;
  let sliderVal = 0;
  let sliderDir = 3;
  await runPhase(30, 70, () => {
    sliderVal += sliderDir;
    if (sliderVal >= 100) { sliderVal = 100; sliderDir = -3; }
    if (sliderVal <= 0) { sliderVal = 0; sliderDir = 3; }
    updateDemoState({ sliderValue: sliderVal });
  });
  if (aborted) return;

  // Phase 3: Text — печатаем по буквам
  phase.value = 3;
  const phrase = 'Real-time sync across windows!';
  tick = 0;
  await runPhase(60, phrase.length, () => {
    tick++;
    updateDemoState({ text: phrase.slice(0, tick) });
  });
  if (aborted) return;

  // Phase 4: All — всё одновременно
  phase.value = 4;
  tick = 0;
  sliderVal = 50;
  sliderDir = 4;
  await runPhase(40, 60, () => {
    tick++;
    sliderVal += sliderDir;
    if (sliderVal >= 100 || sliderVal <= 0) sliderDir = -sliderDir;
    updateDemoState({
      counter: tick,
      color: COLORS[tick % COLORS.length],
      sliderValue: Math.max(0, Math.min(100, sliderVal)),
    });
  });

  stop();
}

function runPhase(intervalMs: number, steps: number, fn: () => void): Promise<void> {
  return new Promise((resolve) => {
    let step = 0;
    timer = setInterval(() => {
      if (aborted || step >= steps) {
        if (timer) clearInterval(timer);
        timer = null;
        resolve();
        return;
      }
      fn();
      step++;
    }, intervalMs);
  });
}

onUnmounted(() => {
  stop();
});
</script>
