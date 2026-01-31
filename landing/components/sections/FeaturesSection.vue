<script setup lang="ts">
import { features } from "~/data/features";

const { content } = useLandingContent();
const { t } = useI18n();

const items = computed(() =>
  features
    .map((feature) => {
      const contentItem = content.value.features.find((item) => item.id === feature.id);
      if (!contentItem) return null;
      return { ...contentItem, icon: feature.icon };
    })
    .filter(Boolean)
);
</script>

<template>
  <section id="features" class="section anchor-offset">
    <v-container>
      <h2 class="text-h4 section-title">{{ t("nav.features") }}</h2>
      <v-row class="ga-4">
        <v-col v-for="item in items" :key="item.id" cols="12" md="4">
          <FeatureCard
            :title="item.title"
            :description="item.description"
            :icon="item.icon"
          />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
