<script setup lang="ts">
const { t } = useI18n();
const year = new Date().getFullYear();
</script>

<template>
  <v-footer class="app-footer" app>
    <v-container class="d-flex align-center justify-space-between">
      <span>{{ t("footer.copyright", { year }) }}</span>
      <div class="d-flex align-center ga-3">
        <span class="footer-tagline">{{ t("footer.tagline") }}</span>
        <span class="footer-separator">·</span>
        <NuxtLink class="footer-link" to="/terms">{{ t("footer.links.terms") }}</NuxtLink>
        <span class="footer-separator">·</span>
        <NuxtLink class="footer-link" to="/privacy-policy">{{ t("footer.links.privacyPolicy") }}</NuxtLink>
        <span class="footer-separator">·</span>
        <NuxtLink class="footer-link" to="/refund-policy">{{ t("footer.links.refundPolicy") }}</NuxtLink>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-link {
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  font-size: 13px;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.95);
  text-decoration: underline;
}

.footer-separator {
  color: rgba(255, 255, 255, 0.35);
  user-select: none;
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
}
</style>
