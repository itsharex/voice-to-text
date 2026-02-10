<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { LinkedProvider } from '../../../domain/types';

defineProps<{
  linkedProviders: LinkedProvider[];
  providerIcon: (provider: string) => string;
  providerLabel: (provider: string) => string;
}>();

const { t } = useI18n();
</script>

<template>
  <template v-if="linkedProviders.length > 0">
    <v-divider class="my-1" />
    <v-list-subheader>{{ t('profile.linkedAccounts') }}</v-list-subheader>
    <v-list-item
      v-for="lp in linkedProviders"
      :key="lp.provider"
    >
      <template #prepend>
        <v-icon>{{ providerIcon(lp.provider) }}</v-icon>
      </template>
      <v-list-item-title class="text-body-2 d-flex align-center ga-2">
        {{ providerLabel(lp.provider) }}
        <v-chip color="success" size="x-small" variant="tonal">
          {{ t('profile.linked') }}
        </v-chip>
      </v-list-item-title>
      <v-list-item-subtitle v-if="lp.provider_email || lp.provider_name" class="text-body-2">
        {{ lp.provider_email ?? lp.provider_name }}
      </v-list-item-subtitle>
    </v-list-item>
  </template>
</template>
