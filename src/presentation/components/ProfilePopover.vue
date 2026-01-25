<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuth } from '../../features/auth/presentation/composables/useAuth';
import { useAuthStore } from '../../features/auth/store/authStore';

const emit = defineEmits<{
  close: []
}>();

const { t } = useI18n();
const auth = useAuth();
const authStore = useAuthStore();

const isLoggingOut = ref(false);

// Пробуем получить email из разных источников
const userEmail = computed(() => {
  // 1. Из userEmail в store (сохраняется при логине)
  if (authStore.userEmail) {
    return authStore.userEmail;
  }
  // 2. Из user в session
  if (authStore.session?.user?.email) {
    return authStore.session.user.email;
  }
  // 3. Заглушка
  return '—';
});

async function handleLogout() {
  isLoggingOut.value = true;
  try {
    await auth.logout();
    emit('close');
  } finally {
    isLoggingOut.value = false;
  }
}
</script>

<template>
  <v-dialog
    :model-value="true"
    max-width="360"
    @update:model-value="emit('close')"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-account-circle</v-icon>
        {{ t('profile.title') }}
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="emit('close')"
        />
      </v-card-title>

      <v-card-text>
        <v-list>
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
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="error"
          variant="tonal"
          block
          :loading="isLoggingOut"
          @click="handleLogout"
        >
          <v-icon start>mdi-logout</v-icon>
          {{ isLoggingOut ? t('profile.loggingOut') : t('profile.logout') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
