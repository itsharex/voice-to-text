<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <section id="screenshots" class="section anchor-offset">
    <v-container>
      <h2 class="text-h4 section-title">{{ t("nav.screenshots") }}</h2>
      <ScreenshotCarousel />
    </v-container>
  </section>
</template>
