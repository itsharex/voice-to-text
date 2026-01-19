<script setup lang="ts">
const { t } = useI18n();
const { label } = usePlatform();
</script>

<template>
  <v-btn color="primary" size="large" href="#download">
    {{ t('hero.ctaPrimary', { platform: label }) }}
  </v-btn>
</template>
