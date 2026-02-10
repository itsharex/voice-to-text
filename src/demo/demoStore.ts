import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDemoStore = defineStore('demo', () => {
  const counter = ref(0);
  const color = ref('#3b82f6');
  const sliderValue = ref(50);
  const text = ref('');
  const revision = ref('0');

  function applySnapshot(data: {
    counter: number;
    color: string;
    sliderValue: number;
    text: string;
  }) {
    counter.value = data.counter;
    color.value = data.color;
    sliderValue.value = data.sliderValue;
    text.value = data.text;
  }

  return {
    counter,
    color,
    sliderValue,
    text,
    revision,
    applySnapshot,
  };
});
