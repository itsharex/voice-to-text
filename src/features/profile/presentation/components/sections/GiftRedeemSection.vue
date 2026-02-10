<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  expanded: boolean;
  giftCodeInput: string;
  isRedeemingGift: boolean;
  giftError: string | null;
  giftSuccessMessage: string | null;
}>();

const emit = defineEmits<{
  toggle: [];
  'update:giftCodeInput': [value: string];
  redeem: [];
}>();

const { t } = useI18n();
const inputRef = ref<{ focus: () => void } | null>(null);

watch(() => props.expanded, (val) => {
  if (val) {
    nextTick(() => {
      setTimeout(() => inputRef.value?.focus(), 250);
    });
  }
});
</script>

<template>
  <div class="gift-redeem-section">
    <v-btn
      variant="tonal"
      size="small"
      :color="expanded ? 'primary' : undefined"
      prepend-icon="mdi-gift-outline"
      @click="emit('toggle')"
    >
      {{ t('profile.gift.title') }}
    </v-btn>

    <v-expand-transition>
      <div v-show="expanded" class="px-4 pb-2 pt-2">
        <div class="text-body-2 text-medium-emphasis mb-2">
          {{ t('profile.gift.hint') }}
        </div>
        <v-text-field
          ref="inputRef"
          :model-value="giftCodeInput"
          :label="t('profile.gift.inputLabel')"
          density="comfortable"
          variant="outlined"
          hide-details
          autocomplete="off"
          @update:model-value="emit('update:giftCodeInput', $event)"
        />
        <div v-if="giftError" class="text-caption text-error mt-2">
          {{ giftError }}
        </div>
        <div v-if="giftSuccessMessage" class="text-caption text-success mt-2">
          {{ giftSuccessMessage }}
        </div>
        <v-btn
          class="mt-3"
          color="primary"
          block
          :loading="isRedeemingGift"
          :disabled="isRedeemingGift"
          @click="emit('redeem')"
        >
          {{ t('profile.gift.cta') }}
        </v-btn>
      </div>
    </v-expand-transition>
  </div>
</template>
