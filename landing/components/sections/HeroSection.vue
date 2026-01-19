<script setup lang="ts">
const { content } = useLandingContent();
const { t } = useI18n();
</script>

<template>
  <section id="hero" class="section hero anchor-offset">
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <h1 class="text-h3 font-weight-bold mb-4">{{ content.hero.title }}</h1>
          <p class="text-body-1 mb-6">{{ content.hero.subtitle }}</p>
          <div class="d-flex ga-3 flex-wrap">
            <DownloadButton />
            <v-btn variant="outlined" href="#features">
              {{ t('hero.ctaSecondary') }}
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <v-card class="pa-6" variant="outlined">
            <div class="text-caption text-medium-emphasis">{{ t("hero.preview") }}</div>
            <div class="screenshot-placeholder mt-4" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.screenshot-placeholder {
  height: 220px;
  border-radius: 16px;
  background: rgba(148, 163, 184, 0.2);
}
</style>
