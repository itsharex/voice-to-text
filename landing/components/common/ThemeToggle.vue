<script setup lang="ts">
const { isDark, toggleTheme } = useBrowserTheme();
const { t } = useI18n();
</script>

<template>
  <v-btn variant="text" @click="toggleTheme">
    <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
    <span class="ml-2">{{ isDark ? t('theme.light') : t('theme.dark') }}</span>
  </v-btn>
</template>
