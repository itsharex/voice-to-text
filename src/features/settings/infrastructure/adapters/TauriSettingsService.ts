/**
 * Сервис для работы с Tauri API в контексте настроек
 * Инкапсулирует все invoke вызовы к бэкенду
 */

import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import type { SttConfig } from '@/types';
import type { AppConfigData, SttConfigData } from '../../domain/types';

// Payload события уровня громкости
interface MicrophoneLevelPayload {
  level: number;
}

class TauriSettingsService {
  // STT конфигурация

  async getSttConfig(): Promise<SttConfig> {
    return invoke<SttConfig>('get_stt_config');
  }

  async updateSttConfig(config: SttConfigData): Promise<void> {
    await invoke('update_stt_config', {
      provider: config.provider,
      language: config.language,
      deepgramApiKey: config.deepgramApiKey,
      assemblyaiApiKey: config.assemblyaiApiKey,
      model: config.model,
    });
  }

  // App конфигурация

  async getAppConfig(): Promise<AppConfigData> {
    return invoke<AppConfigData>('get_app_config');
  }

  async updateAppConfig(config: Partial<AppConfigData>): Promise<void> {
    await invoke('update_app_config', {
      microphoneSensitivity: config.microphone_sensitivity,
      recordingHotkey: config.recording_hotkey,
      autoCopyToClipboard: config.auto_copy_to_clipboard,
      autoPasteText: config.auto_paste_text,
      selectedAudioDevice: config.selected_audio_device,
    });
  }

  // Аудио устройства

  async getAudioDevices(): Promise<string[]> {
    return invoke<string[]>('get_audio_devices');
  }

  // Тест микрофона

  async startMicrophoneTest(
    sensitivity: number,
    deviceName: string | null
  ): Promise<void> {
    await invoke('start_microphone_test', {
      sensitivity,
      deviceName,
    });
  }

  async stopMicrophoneTest(): Promise<number[]> {
    return invoke<number[]>('stop_microphone_test');
  }

  listenMicrophoneLevel(
    callback: (level: number) => void
  ): Promise<UnlistenFn> {
    return listen<MicrophoneLevelPayload>('microphone_test:level', (event) => {
      callback(event.payload.level);
    });
  }

  // Accessibility разрешения (macOS)

  async checkAccessibilityPermission(): Promise<boolean> {
    return invoke<boolean>('check_accessibility_permission');
  }

  async requestAccessibilityPermission(): Promise<void> {
    await invoke('request_accessibility_permission');
  }

  // Whisper модели

  async checkWhisperModel(modelName: string): Promise<boolean> {
    return invoke<boolean>('check_whisper_model', { modelName });
  }
}

// Singleton экземпляр
export const tauriSettingsService = new TauriSettingsService();
