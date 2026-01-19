<script setup lang="ts">
import { supportedLocales } from "~/data/i18n";
import type { LocaleCode } from "~/data/i18n";
import { useLocaleStore } from "~/stores/locale";

const { t, locale } = useI18n();
const nuxtApp = useNuxtApp();
const switchLocalePath = useSwitchLocalePath();
const props = defineProps<{ fullWidth?: boolean; compact?: boolean }>();
const localeStore = useLocaleStore();

const items = computed(() =>
  supportedLocales.map((item) => ({
    title: item.name,
    value: item.code as LocaleCode
  }))
);

const onChange = async (value: string | LocaleCode) => {
  const nextLocale = value as LocaleCode;
  localeStore.setLocale(nextLocale, true);
  if (nuxtApp.$i18n?.setLocale) {
    await nuxtApp.$i18n.setLocale(nextLocale);
  } else {
    locale.value = nextLocale;
  }
  const path = switchLocalePath(nextLocale);
  if (path) {
    await navigateTo(path);
  }
};
</script>

<template>
  <v-select
    :label="props.compact ? undefined : t('language.label')"
    :placeholder="props.compact ? t('language.label') : undefined"
    :items="items"
    :model-value="locale"
    density="compact"
    :variant="props.compact ? 'plain' : 'outlined'"
    hide-details
    @update:model-value="onChange"
    :style="props.fullWidth ? { maxWidth: '100%', width: '100%' } : { maxWidth: '180px' }"
    :class="{
      'language-switcher--full': props.fullWidth,
      'language-switcher--compact': props.compact
    }"
    :aria-label="t('language.label')"
    :single-line="props.compact"
  />
</template>

<style scoped>
.language-switcher--compact :deep(.v-field) {
  min-height: 36px;
}

.language-switcher--compact :deep(.v-field__input) {
  padding-top: 6px;
  padding-bottom: 6px;
  min-height: 36px;
}

.language-switcher--compact {
  min-width: 90px;
  position: relative;
  z-index: 2;
}

.language-switcher--compact :deep(.v-field__outline) {
  display: none;
}

.language-switcher--compact :deep(.v-field__overlay) {
  background-color: transparent;
}
</style>
