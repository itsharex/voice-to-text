import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { useUpdateStore } from '../stores/update';
import { useI18n } from 'vue-i18n';

// Singleton для listener - должен быть один на всё приложение
let unlistenUpdateAvailable: UnlistenFn | null = null;

// Composable для работы с обновлениями приложения
// Единый источник логики обновлений для всех компонентов (DRY)
export function useUpdater() {
  const store = useUpdateStore();
  const { t } = useI18n();

  // Проверка обновлений вручную
  async function checkForUpdates(): Promise<string | null> {
    store.isChecking = true;
    store.error = null;

    try {
      const version = await invoke<string | null>('check_for_updates');

      if (version) {
        store.setAvailableUpdate(version);
        return version;
      } else {
        // Нет доступных обновлений
        store.error = t('settings.updates.latest');
        return null;
      }
    } catch (err) {
      console.error('Failed to check for updates:', err);
      store.error = String(err);
      return null;
    } finally {
      store.isChecking = false;
    }
  }

  // Установка обновления
  async function installUpdate(): Promise<void> {
    store.isInstalling = true;
    store.error = null;

    try {
      await invoke('install_update');
      // После успешной установки приложение перезапустится,
      // поэтому сбрасывать состояние не нужно
    } catch (err) {
      console.error('Failed to install update:', err);
      store.error = String(err);
      store.isInstalling = false;
    }
  }

  // Отказ от обновления (закрыть диалог)
  function dismissUpdate(): void {
    store.dismiss();
  }

  // Настроить глобальный listener для события 'update:available'
  // Вызывается один раз в App.vue
  async function setupUpdateListener(): Promise<void> {
    // Предотвращаем дублирование listeners
    if (unlistenUpdateAvailable) {
      return;
    }

    try {
      unlistenUpdateAvailable = await listen<string>('update:available', (event) => {
        console.log('Update available event received:', event.payload);
        store.setAvailableUpdate(event.payload);
      });
    } catch (err) {
      console.error('Failed to setup update listener:', err);
    }
  }

  // Очистка listeners
  function cleanupUpdateListener(): void {
    if (unlistenUpdateAvailable) {
      unlistenUpdateAvailable();
      unlistenUpdateAvailable = null;
    }
  }

  return {
    // Store state (реактивные ссылки)
    store,

    // Actions
    checkForUpdates,
    installUpdate,
    dismissUpdate,
    setupUpdateListener,
    cleanupUpdateListener,
  };
}
