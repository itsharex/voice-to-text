<script setup lang="ts">
import { sectionOrder } from "~/data/sections";

usePageSeo("meta.homeTitle", "meta.homeDescription");

const sectionComponents: Record<string, string> = {
  hero: "HeroSection",
  features: "FeaturesSection",
  providers: "ProvidersSection",
  screenshots: "ScreenshotsSection",
  download: "DownloadSection",
  privacy: "PrivacySection",
  faq: "FAQSection"
};
</script>

<template>
  <component
    :is="sectionComponents[section]"
    v-for="section in sectionOrder"
    :key="section"
  />
</template>
