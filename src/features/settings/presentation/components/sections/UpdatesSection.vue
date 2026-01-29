<script setup lang="ts">
/**
 * Секция проверки и установки обновлений
 */

import { useI18n } from 'vue-i18n';
import { useUpdater } from '@/composables/useUpdater';
import SettingGroup from '../shared/SettingGroup.vue';

const emit = defineEmits<{
  'show-update-dialog': [];
}>();

const { t } = useI18n();
const { store: updateStore, checkForUpdates } = useUpdater();
</script>

<template>
  <SettingGroup :title="t('settings.updates.label')">
    <div class="text-caption text-medium-emphasis mb-3">
      <p class="mb-1">{{ t('settings.updates.hintLine1') }}</p>
      <p class="mb-0">{{ t('settings.updates.hintLine2') }}</p>
    </div>

    <div class="d-flex flex-column ga-3">
      <!-- Кнопка проверки обновлений -->
      <v-btn
        color="primary"
        variant="flat"
        :loading="updateStore.isChecking"
        class="align-self-start"
        @click="checkForUpdates"
      >
        <v-icon start>mdi-update</v-icon>
        {{ updateStore.isChecking ? t('settings.updates.checking') : t('settings.updates.check') }}
      </v-btn>

      <!-- Доступное обновление -->
      <v-alert
        v-if="updateStore.availableVersion"
        type="success"
        variant="tonal"
      >
        <div class="d-flex flex-column">
          <div class="d-flex align-center ga-2 mb-1">
            <v-icon>mdi-party-popper</v-icon>
            <span class="font-weight-medium">
              {{ t('settings.updates.availableTitle', { version: updateStore.availableVersion }) }}
            </span>
          </div>
          <div class="text-body-2 mb-2">
            {{ t('settings.updates.availableSubtitle') }}
          </div>
          <v-btn
            color="success"
            variant="flat"
            size="small"
            class="align-self-start"
            @click="emit('show-update-dialog')"
          >
            {{ t('settings.updates.install') }}
          </v-btn>
        </div>
      </v-alert>

      <!-- Сообщение об ошибке или "нет обновлений" -->
      <v-alert
        v-if="updateStore.error && !updateStore.availableVersion"
        type="info"
        variant="tonal"
        density="compact"
      >
        {{ updateStore.error }}
      </v-alert>
    </div>
  </SettingGroup>
</template>
