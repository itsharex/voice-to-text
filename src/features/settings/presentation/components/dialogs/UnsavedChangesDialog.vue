<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  continueLabel: string;
  discardLabel: string;
  saveLabel: string;
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  continue: [];
  discard: [];
  save: [];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

function handleContinue(): void {
  emit('continue');
  isOpen.value = false;
}

function handleDiscard(): void {
  emit('discard');
}

function handleSave(): void {
  emit('save');
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="420" persistent>
    <v-card rounded="lg">
      <v-card-title class="text-h6">
        {{ title }}
      </v-card-title>

      <v-card-text class="text-body-2 text-medium-emphasis">
        {{ message }}
      </v-card-text>

      <v-card-actions class="unsaved-actions pa-4 pt-0">
        <v-btn
          class="unsaved-actions__btn"
          variant="text"
          :disabled="isSaving"
          @click="handleContinue"
        >
          {{ continueLabel }}
        </v-btn>
        <v-btn
          class="unsaved-actions__btn"
          color="error"
          variant="text"
          :disabled="isSaving"
          @click="handleDiscard"
        >
          {{ discardLabel }}
        </v-btn>
        <v-btn
          class="unsaved-actions__btn"
          color="primary"
          variant="flat"
          :loading="isSaving"
          @click="handleSave"
        >
          {{ saveLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.unsaved-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

.unsaved-actions__btn {
  width: 100%;
}

@media (min-width: 560px) {
  .unsaved-actions {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
  }

  .unsaved-actions__btn {
    width: auto;
    max-width: 100%;
  }
}
</style>
