<script setup lang="ts">
/**
 * Секция выбора темы (dark/light)
 */

import { useI18n } from 'vue-i18n';
import SettingGroup from '../shared/SettingGroup.vue';
import { useSettingsTheme } from '../../composables/useSettingsTheme';

const { t } = useI18n();
const { currentTheme, setTheme } = useSettingsTheme();
</script>

<template>
  <SettingGroup :title="t('settings.theme.label')">
    <v-btn-toggle
      :model-value="currentTheme"
      mandatory
      divided
      density="comfortable"
      color="primary"
      class="w-100"
      @update:model-value="setTheme($event)"
    >
      <v-btn value="dark" class="flex-grow-1">
        <v-icon start>mdi-weather-night</v-icon>
        {{ t('settings.theme.dark') }}
      </v-btn>
      <v-btn value="light" class="flex-grow-1">
        <v-icon start>mdi-white-balance-sunny</v-icon>
        {{ t('settings.theme.light') }}
      </v-btn>
    </v-btn-toggle>
  </SettingGroup>
</template>
