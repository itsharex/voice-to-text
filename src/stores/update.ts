import { defineStore } from 'pinia';
import { ref } from 'vue';

// Хранилище состояния обновлений приложения
export const useUpdateStore = defineStore('update', () => {
  // Доступная версия обновления (null если нет обновлений)
  const availableVersion = ref<string | null>(null);

  // Release notes для обновления
  const releaseNotes = ref<string | null>(null);

  // Флаг процесса проверки обновлений
  const isChecking = ref(false);

  // Флаг процесса установки обновления
  const isInstalling = ref(false);

  // Сообщение об ошибке (если есть)
  const error = ref<string | null>(null);

  // Установить информацию о доступном обновлении
  function setAvailableUpdate(version: string, notes?: string) {
    availableVersion.value = version;
    releaseNotes.value = notes ?? null;
    error.value = null;
  }

  // Сбросить состояние (при отказе от обновления)
  function dismiss() {
    availableVersion.value = null;
    releaseNotes.value = null;
    error.value = null;
  }

  // Очистить ошибку
  function clearError() {
    error.value = null;
  }

  // Сбросить всё состояние
  function reset() {
    availableVersion.value = null;
    releaseNotes.value = null;
    isChecking.value = false;
    isInstalling.value = false;
    error.value = null;
  }

  return {
    // State
    availableVersion,
    releaseNotes,
    isChecking,
    isInstalling,
    error,

    // Actions
    setAvailableUpdate,
    dismiss,
    clearError,
    reset,
  };
});
