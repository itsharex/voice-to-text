<script setup lang="ts">
const { t } = useI18n();
const { isDark, toggleTheme } = useBrowserTheme();

const tooltip = computed(() => isDark.value ? t('theme.light') : t('theme.dark'));
</script>

<template>
  <v-tooltip :text="tooltip" location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        size="small"
        :aria-label="tooltip"
        @click="toggleTheme"
      />
    </template>
  </v-tooltip>
</template>
