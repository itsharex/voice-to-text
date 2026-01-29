<script setup lang="ts">
/**
 * Секция настройки горячей клавиши
 */

import { useI18n } from 'vue-i18n';
import SettingGroup from '../shared/SettingGroup.vue';
import { useSettings } from '../../composables/useSettings';

const { t } = useI18n();
const { recordingHotkey } = useSettings();
</script>

<template>
  <SettingGroup :title="t('settings.hotkey.label')">
    <v-text-field
      v-model="recordingHotkey"
      :placeholder="t('settings.hotkey.placeholder')"
      density="comfortable"
      hide-details
      prepend-inner-icon="mdi-keyboard"
    />

    <template #hint>
      <div class="text-caption text-medium-emphasis mt-2">
        <p class="mb-1">{{ t('settings.hotkey.hintLine1') }}</p>
        <p class="mb-1">{{ t('settings.hotkey.hintLine2') }}</p>
        <p class="mb-0">{{ t('settings.hotkey.hintLine3') }}</p>
      </div>
    </template>
  </SettingGroup>
</template>
