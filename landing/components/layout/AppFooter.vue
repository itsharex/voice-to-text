<script setup lang="ts">
const { t } = useI18n();
const year = new Date().getFullYear();
</script>

<template>
  <v-footer class="app-footer" app>
    <v-container class="d-flex align-center justify-space-between">
      <span>{{ t("footer.copyright", { year }) }}</span>
      <span>{{ t("footer.tagline") }}</span>
    </v-container>
  </v-footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
