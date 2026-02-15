<script setup lang="ts">
const { t } = useI18n();
const menuOpen = ref(false);
const { trackNavClick } = useAnalytics();

const navItems = computed(() => [
  { id: 'features', label: t('nav.features') },
  { id: 'pricing', label: t('nav.pricing') },
  { id: 'download', label: t('nav.download') },
]);
</script>

<template>
  <header class="app-header">
    <v-container class="app-header__inner">
      <AppLogo />
      <nav class="app-header__nav">
        <v-btn v-for="item in navItems" :key="item.id" variant="text" :href="`#${item.id}`" @click="trackNavClick(item.id)">
          {{ item.label }}
        </v-btn>
      </nav>
      <div class="app-header__spacer" />
      <div class="app-header__desktop-actions">
        <LanguageSwitcher compact />
        <ThemeToggle />
      </div>
      <div class="app-header__mobile-actions">
        <v-btn icon="mdi-menu" variant="text" @click="menuOpen = true" />
        <v-dialog v-model="menuOpen" fullscreen scrim>
          <v-card class="mobile-menu">
            <div class="mobile-menu__header">
              <AppLogo />
              <v-spacer />
              <v-btn icon="mdi-close" variant="text" @click="menuOpen = false" />
            </div>
            <v-divider />
            <v-list class="mobile-menu__list">
              <v-list-item
                v-for="item in navItems"
                :key="item.id"
                :title="item.label"
                :href="`#${item.id}`"
                @click="trackNavClick(item.id); menuOpen = false"
              />
            </v-list>
            <v-divider />
            <div class="mobile-menu__actions">
              <LanguageSwitcher icon-only />
              <ThemeToggle />
            </div>
          </v-card>
        </v-dialog>
      </div>
    </v-container>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.v-theme--light .app-header {
  background: rgba(255, 255, 255, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

.v-theme--dark .app-header {
  background: rgba(18, 18, 18, 0.85);
}

.app-header__inner {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

/* Desktop nav — скрыто на мобилке через CSS media query (SSR-safe) */
.app-header__nav {
  display: flex;
  align-self: stretch;
  align-items: stretch;
  margin-left: 16px;
}

.app-header__nav :deep(.v-btn) {
  height: 100% !important;
  border-radius: 0;
}

.app-header__spacer {
  flex: 1;
}

.app-header__desktop-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Мобильное меню — скрыто на десктопе через CSS */
.app-header__mobile-actions {
  display: none;
}

.app-header__mobile-actions :deep(.v-list-item) {
  min-height: 40px;
}

@media (max-width: 959px) {
  .app-header__nav {
    display: none;
  }

  .app-header__desktop-actions {
    display: none;
  }

  .app-header__mobile-actions {
    display: flex;
  }
}

.mobile-menu {
  padding: 16px 16px 24px;
}

.mobile-menu__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
}

.mobile-menu__list {
  padding: 8px 0;
}

.mobile-menu__actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding-top: 16px;
}
</style>
