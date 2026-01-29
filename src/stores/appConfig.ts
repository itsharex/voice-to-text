import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { isTauriAvailable } from '@/utils/tauri';

interface AppConfigSnapshot {
  revision: number;
  config: {
    recording_hotkey?: string;
    auto_copy_to_clipboard?: boolean;
    auto_paste_text?: boolean;
    microphone_sensitivity?: number;
    selected_audio_device?: string | null;
  };
}

interface ConfigChangedPayload {
  revision: number;
  ts: number;
  source_window?: string | null;
  scope?: string | null;
}

export const useAppConfigStore = defineStore('appConfig', () => {
  const revision = ref(0);
  const isLoaded = ref(false);
  const isSyncing = ref(false);

  const recordingHotkey = ref('CmdOrCtrl+Shift+X');
  const autoCopyToClipboard = ref(true);
  const autoPasteText = ref(false);
  const microphoneSensitivity = ref(95);
  const selectedAudioDevice = ref('');

  let unlistenConfigChanged: UnlistenFn | null = null;
  let isRefreshing = false;
  let hasPendingRefresh = false;

  function applySnapshot(snapshot: AppConfigSnapshot): void {
    revision.value = Number(snapshot.revision) || 0;

    const cfg = snapshot.config ?? {};
    recordingHotkey.value = cfg.recording_hotkey ?? recordingHotkey.value;
    autoCopyToClipboard.value = cfg.auto_copy_to_clipboard ?? autoCopyToClipboard.value;
    autoPasteText.value = cfg.auto_paste_text ?? autoPasteText.value;
    microphoneSensitivity.value = cfg.microphone_sensitivity ?? microphoneSensitivity.value;
    selectedAudioDevice.value = cfg.selected_audio_device ?? '';

    isLoaded.value = true;
  }

  async function refresh(): Promise<void> {
    if (!isTauriAvailable()) return;
    if (isRefreshing) {
      hasPendingRefresh = true;
      return;
    }
    isRefreshing = true;

    try {
      const snapshot = await invoke<AppConfigSnapshot>('get_app_config_snapshot');
      applySnapshot(snapshot);
    } finally {
      isRefreshing = false;
      if (hasPendingRefresh) {
        hasPendingRefresh = false;
        await refresh();
      }
    }
  }

  async function startSync(): Promise<void> {
    if (!isTauriAvailable()) return;
    if (isSyncing.value) return;

    // Важно: сначала подписываемся, потом делаем refresh.
    // Иначе можно пропустить config:changed между refresh() и listen().
    const unlisten = await listen<ConfigChangedPayload>(
      'config:changed',
      async (event) => {
        const incomingRev = Number(event.payload?.revision) || 0;
        if (incomingRev <= revision.value) return;

        // Для main окна важнее всего scope="app", но если scope не передан — лучше обновиться.
        const scope = event.payload?.scope ?? null;
        if (scope && scope !== 'app') return;

        await refresh();
      }
    );

    unlistenConfigChanged = unlisten;

    try {
      await refresh();
      isSyncing.value = true;
    } catch (e) {
      stopSync();
      throw e;
    }
  }

  function stopSync(): void {
    if (unlistenConfigChanged) {
      unlistenConfigChanged();
      unlistenConfigChanged = null;
    }
    isSyncing.value = false;
  }

  return {
    // State
    revision,
    isLoaded,
    isSyncing,
    recordingHotkey,
    autoCopyToClipboard,
    autoPasteText,
    microphoneSensitivity,
    selectedAudioDevice,

    // Computed
    hasSelectedAudioDevice: computed(() => Boolean(selectedAudioDevice.value)),

    // Actions
    refresh,
    startSync,
    stopSync,
    applySnapshot,
  };
});

