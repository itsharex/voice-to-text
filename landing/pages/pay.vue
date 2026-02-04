<script setup lang="ts">
usePageSeo("meta.payTitle", "meta.payDescription");
</script>

<template>
  <v-container class="section legal-page">
    <h1 class="text-h4 section-title">Opening secure checkout…</h1>
    <p class="text-body-2 legal-updated">
      If you were redirected here from a Paddle email, the checkout should open automatically.
    </p>

    <div class="legal-content">
      <section class="legal-section">
        <h2 class="text-h6">If nothing happens</h2>
        <p>
          Please make sure JavaScript is enabled and any script blockers are disabled for this
          site, then refresh the page.
        </p>
      </section>
    </div>
  </v-container>
</template>

<style scoped>
.legal-page {
  max-width: 800px;
}

.legal-updated {
  color: rgba(var(--v-theme-on-background), 0.6);
  margin-bottom: 32px;
}

.legal-content {
  line-height: 1.7;
}

.legal-section {
  margin-bottom: 32px;
}

.legal-section h2 {
  margin-bottom: 12px;
}

.legal-section p {
  margin-bottom: 12px;
}
</style>

