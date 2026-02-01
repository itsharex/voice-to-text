<script setup lang="ts">
/**
 * Секция выбора языка распознавания
 */

import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SettingGroup from '../shared/SettingGroup.vue';
import FlagIcon from '@/presentation/components/FlagIcon.vue';
import { useSettings } from '../../composables/useSettings';
import { UI_LOCALES, type UiLocale } from '@/i18n.locales';

const { t } = useI18n();
const { language, syncLocale } = useSettings();

interface UiLanguageOption {
  value: UiLocale;
  label: string;
}

const languageOptions = computed<UiLanguageOption[]>(() =>
  UI_LOCALES.map(code => ({
    value: code,
    label: t(`languages.${code}`),
  }))
);

// Синхронизируем UI локаль при изменении языка
watch(language, () => {
  syncLocale();
});
</script>

<template>
  <SettingGroup :title="t('settings.language.label')">
    <v-autocomplete
      data-testid="settings-language-autocomplete"
      v-model="language"
      :items="languageOptions"
      item-title="label"
      item-value="value"
      density="comfortable"
      hide-details
      :placeholder="t('settings.language.searchPlaceholder')"
      auto-select-first="exact"
      :clearable="false"
    >
      <template #selection="{ item }">
        <FlagIcon :locale="(item?.raw as UiLanguageOption)?.value" :size="18" class="mr-2" />
        <span>{{ (item?.raw as UiLanguageOption)?.label }}</span>
      </template>

      <template #item="{ props, item }">
        <v-list-item v-bind="props">
          <template #prepend>
            <FlagIcon :locale="(item?.raw as UiLanguageOption)?.value" :size="18" class="mr-2" />
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
  </SettingGroup>
</template>
