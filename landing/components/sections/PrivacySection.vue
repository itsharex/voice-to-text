<script setup lang="ts">
const { content } = useLandingContent();
</script>

<template>
  <section id="privacy" class="section anchor-offset">
    <v-container>
      <h2 class="text-h4 section-title">{{ content.privacy.title }}</h2>
      <ul>
        <li v-for="item in content.privacy.bullets" :key="item">{{ item }}</li>
      </ul>
      <p class="text-body-2 mt-4">{{ content.privacy.openSourceNote }}</p>
    </v-container>
  </section>
</template>
