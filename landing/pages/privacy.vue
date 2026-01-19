<script setup lang="ts">
const { content } = useLandingContent();

usePageSeo("meta.privacyTitle", "meta.privacyDescription");
</script>

<template>
  <v-container class="section">
    <h1 class="text-h4 section-title">{{ content.privacy.title }}</h1>
    <PrivacySection />
  </v-container>
</template>
