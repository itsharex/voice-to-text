<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { LicenseInfo } from '../../../domain/types';

defineProps<{
  userEmail: string;
  licenseLoading: boolean;
  license: LicenseInfo | null;
  planLabel: string | null;
  statusColor: string;
  statusLabel: string;
  usageInfo: { used: number; total: number; remaining: number; percent: number } | null;
}>();

const { t } = useI18n();
</script>

<template>
  <v-list>
    <!-- Email -->
    <v-list-item>
      <template #prepend>
        <v-icon>mdi-email-outline</v-icon>
      </template>
      <v-list-item-title class="text-body-2 text-medium-emphasis">
        {{ t('profile.email') }}
      </v-list-item-title>
      <v-list-item-subtitle class="text-body-1">
        {{ userEmail }}
      </v-list-item-subtitle>
    </v-list-item>

    <!-- План — стабильная структура, без layout shift -->
    <v-list-item>
      <template #prepend>
        <v-icon>mdi-card-account-details-outline</v-icon>
      </template>
      <v-list-item-title class="text-body-2 text-medium-emphasis">
        {{ t('profile.plan') }}
      </v-list-item-title>
      <v-list-item-subtitle class="text-body-1 d-flex align-center ga-2">
        <template v-if="licenseLoading">
          <v-progress-circular size="14" width="2" indeterminate />
        </template>
        <template v-else-if="license">
          {{ planLabel }}
          <v-chip :color="statusColor" size="x-small" variant="tonal">
            {{ statusLabel }}
          </v-chip>
        </template>
        <template v-else>
          {{ t('profile.noPlan') }}
        </template>
      </v-list-item-subtitle>
    </v-list-item>

    <!-- Использование -->
    <v-list-item v-if="license && usageInfo">
      <template #prepend>
        <v-icon>mdi-clock-outline</v-icon>
      </template>
      <v-list-item-title class="text-body-2 text-medium-emphasis">
        {{ t('profile.usage') }}
      </v-list-item-title>
      <v-list-item-subtitle class="text-body-1">
        {{ t('profile.usageDetail', { used: usageInfo.used, total: usageInfo.total }) }}
      </v-list-item-subtitle>
      <v-progress-linear
        class="mt-2 rounded"
        :model-value="usageInfo.percent"
        :color="usageInfo.percent >= 90 ? 'error' : usageInfo.percent >= 70 ? 'warning' : 'primary'"
        height="6"
        rounded
      />
    </v-list-item>
  </v-list>
</template>
