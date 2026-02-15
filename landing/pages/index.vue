<script setup lang="ts">
usePageSeo("meta.homeTitle", "meta.homeDescription");
useTrackSections();
const { containerRef } = useParallaxSections();
</script>

<template>
  <div ref="containerRef" class="page">
    <HeroSection />
    <LazyFeaturesSection />
    <LazyProvidersSection />
    <LazySupportedLanguages />
    <LazyScreenshotsSection />
    <LazyPricingSection />
    <LazyTestimonialsSection />
    <LazyDownloadSection />
    <LazyPrivacySection />
    <LazyFAQSection />
  </div>
</template>
