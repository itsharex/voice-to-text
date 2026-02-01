<script setup lang="ts">
/**
 * Иконка флага страны по коду локали.
 * Использует CDN flagcdn.com (SVG).
 */

import { computed } from 'vue';
import { getFlagUrl, type UiLocale } from '@/i18n.locales';

const props = withDefaults(defineProps<{
  locale: UiLocale;
  size?: number;
}>(), {
  size: 18,
});

const src = computed(() => getFlagUrl(props.locale));
const imgSize = computed(() => `${props.size}px`);
</script>

<template>
  <img
    :src="src"
    :width="size"
    :height="Math.round(size * 0.75)"
    :alt="locale"
    class="flag-icon"
    loading="lazy"
  />
</template>

<style scoped>
.flag-icon {
  width: v-bind(imgSize);
  border-radius: 2px;
  object-fit: cover;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
