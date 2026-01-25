<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch, ref } from 'vue';
import { useTheme } from 'vuetify';
import { useAuth, useAuthState } from './features/auth';
import AuthScreen from './features/auth/presentation/components/AuthScreen.vue';
import RecordingPopover from './presentation/components/RecordingPopover.vue';
import { invoke } from '@tauri-apps/api/core';
import { listen, emit, type UnlistenFn } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useUpdater } from './composables/useUpdater';
import { getWindowMode, type AppWindowLabel } from './windowing/windowMode';

const auth = useAuth();
const authState = useAuthState();
const theme = useTheme();
const { setupUpdateListener, cleanupUpdateListener } = useUpdater();

// Слушатель события изменения авторизации из другого окна
let unlistenAuthChange: UnlistenFn | null = null;

// Флаг завершения инициализации (чтобы не мелькал AuthScreen)
const isInitialized = ref(false);

// Флаг: изменение пришло от другого окна (не отправлять событие в ответ)
let isExternalAuthChange = false;

const windowLabel = ref<AppWindowLabel>('unknown');

const mode = computed(() =>
  getWindowMode({
    windowLabel: windowLabel.value,
    isInitialized: isInitialized.value,
    isAuthenticated: authState.isAuthenticated.value,
  })
);

const showLoading = computed(() => mode.value.render === 'loading');
const showAuth = computed(() => mode.value.render === 'auth');
const showApp = computed(() => mode.value.render === 'main');

// Если окно по правилам не должно показывать UI — прячем его, чтобы не оставалось "невидимого стекла".
watch(
  () => mode.value.render,
  async (render) => {
    if (!isInitialized.value) return;
    if (render !== 'none') return;
    try {
      await getCurrentWindow().hide();
    } catch {}
  }
);

// Синхронизация темы с localStorage
const storedTheme = localStorage.getItem('uiTheme') || 'dark';
theme.global.name.value = storedTheme;

watch(() => theme.global.name.value, (newTheme) => {
  localStorage.setItem('uiTheme', String(newTheme));
});

// При смене состояния авторизации - синхронизируем с backend и переключаем окна
watch(() => authState.isAuthenticated.value, async (isAuth) => {
  if (!isInitialized.value) return;

  try {
    // Синхронизируем флаг авторизации с backend (для hotkey handler)
    await invoke('set_authenticated', { authenticated: isAuth });

    // Уведомляем другие окна только если это локальное изменение (не от другого окна)
    if (!isExternalAuthChange) {
      const currentWindow = getCurrentWindow();
      await emit('auth-state-changed', {
        isAuthenticated: isAuth,
        sourceWindow: currentWindow.label
      });
    }
    isExternalAuthChange = false;

    // Переключение делаем по правилам окна, чтобы main не показывал auth UI и наоборот.
    // Важно: сначала прячем текущее окно (иногда hide из backend может не отработать вовремя).
    if (windowLabel.value === 'auth' && isAuth) {
      try {
        await getCurrentWindow().hide();
      } catch {}
      await invoke('show_recording_window');
    } else if (windowLabel.value === 'main' && !isAuth) {
      try {
        await getCurrentWindow().hide();
      } catch {}
      await invoke('show_auth_window');
    }
  } catch (e) {
    console.warn('Failed to switch windows:', e);
  }
});

onMounted(async () => {
  // Настраиваем глобальный listener для обновлений
  await setupUpdateListener();

  try {
    try {
      const label = String(getCurrentWindow().label);
      windowLabel.value = label === 'main' || label === 'auth' ? label : 'unknown';
    } catch {
      windowLabel.value = 'unknown';
    }

    await auth.initialize();
  } finally {
    isInitialized.value = true;

    // Синхронизируем флаг авторизации с backend
    const isAuth = authState.isAuthenticated.value;
    await invoke('set_authenticated', { authenticated: isAuth });

    // После инициализации показываем нужное окно
    if (windowLabel.value === 'main' && !isAuth) {
      try {
        await getCurrentWindow().hide();
      } catch {}
      await invoke('show_auth_window');
    } else if (windowLabel.value === 'auth' && isAuth) {
      try {
        await getCurrentWindow().hide();
      } catch {}
      await invoke('show_recording_window');
    }
  }

  // Слушаем событие изменения авторизации из другого окна
  const currentWindow = getCurrentWindow();
  unlistenAuthChange = await listen<{ isAuthenticated: boolean; sourceWindow: string }>(
    'auth-state-changed',
    async (event) => {
      // Игнорируем события от своего окна
      if (event.payload.sourceWindow === currentWindow.label) return;

      console.log('Auth state changed from another window, reinitializing...');
      // Помечаем что это внешнее изменение (чтобы watch не отправил событие в ответ)
      isExternalAuthChange = true;
      await auth.initialize();
    }
  );
});

onUnmounted(() => {
  if (unlistenAuthChange) {
    unlistenAuthChange();
  }
  cleanupUpdateListener();
});
</script>

<template>
  <v-app>
    <!-- Loading при инициализации -->
    <v-container v-if="showLoading" class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />
      </v-row>
    </v-container>

    <AuthScreen v-else-if="showAuth" />

    <div v-else-if="showApp" class="app">
      <RecordingPopover />
    </div>
  </v-app>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
  display: block;
  margin: 0;
  padding: 0;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: transparent;
  position: relative;
}
</style>
