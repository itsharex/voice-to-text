<script setup lang="ts">
usePageSeo("meta.checkoutSuccessTitle", "meta.checkoutSuccessDescription");
</script>

<template>
  <v-container class="section legal-page">
    <h1 class="text-h4 section-title">Payment successful</h1>
    <p class="text-body-2 legal-updated">Thanks — we received your payment.</p>

    <div class="legal-content">
      <section class="legal-section">
        <h2 class="text-h6">What happens next</h2>
        <p>
          We provision access using secure Paddle webhooks. This may take a short moment.
        </p>
        <p>
          If your purchase includes a license key, you will receive it by email shortly.
        </p>
      </section>

      <section class="legal-section">
        <h2 class="text-h6">If something looks wrong</h2>
        <p>
          If you don’t receive an email within a few minutes, please check spam/junk folders and
          then contact us.
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

