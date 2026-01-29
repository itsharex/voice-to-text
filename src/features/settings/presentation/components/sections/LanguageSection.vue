<script setup lang="ts">
/**
 * Секция выбора языка распознавания
 */

import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SettingGroup from '../shared/SettingGroup.vue';
import { useSettings } from '../../composables/useSettings';
import type { LanguageOption } from '../../../domain/types';

const { t } = useI18n();
const { language, syncLocale } = useSettings();

const languageOptions = computed<LanguageOption[]>(() => [
  { value: 'en', label: t('languages.en') },
  { value: 'ru', label: t('languages.ru') },
  { value: 'uk', label: t('languages.uk') },
  { value: 'es', label: t('languages.es') },
  { value: 'fr', label: t('languages.fr') },
  { value: 'de', label: t('languages.de') },
]);

// Синхронизируем UI локаль при изменении языка
watch(language, () => {
  syncLocale();
});
</script>

<template>
  <SettingGroup :title="t('settings.language.label')">
    <v-select
      v-model="language"
      :items="languageOptions"
      item-title="label"
      item-value="value"
      density="comfortable"
      hide-details
    />
  </SettingGroup>
</template>
