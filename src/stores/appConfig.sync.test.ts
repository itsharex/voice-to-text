import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAppConfigStore } from './appConfig';

const invokeMock = vi.fn();
const listenMock = vi.fn();

vi.mock('@tauri-apps/api/core', () => ({
  invoke: (...args: any[]) => invokeMock(...args),
}));

vi.mock('@tauri-apps/api/event', () => ({
  listen: (...args: any[]) => listenMock(...args),
}));

describe('useAppConfigStore sync', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    (window as any).__TAURI__ = {};
    invokeMock.mockReset();
    listenMock.mockReset();
  });

  it('startSync: загружает snapshot и подписывается на config:changed', async () => {
    const listeners: Array<(event: any) => Promise<void>> = [];
    listenMock.mockImplementation(async (_event: string, handler: any) => {
      listeners.push(handler);
      return () => {};
    });

    invokeMock.mockResolvedValue({
      revision: 7,
      config: {
        recording_hotkey: 'CmdOrCtrl+Shift+P',
        auto_copy_to_clipboard: false,
        auto_paste_text: true,
        microphone_sensitivity: 120,
        selected_audio_device: 'Mic A',
      },
    });

    const store = useAppConfigStore();
    await store.startSync();

    expect(invokeMock).toHaveBeenCalledWith('get_app_config_snapshot');
    expect(store.revision).toBe(7);
    expect(store.recordingHotkey).toBe('CmdOrCtrl+Shift+P');
    expect(store.autoCopyToClipboard).toBe(false);
    expect(store.autoPasteText).toBe(true);
    expect(store.microphoneSensitivity).toBe(120);
    expect(store.selectedAudioDevice).toBe('Mic A');
    expect(listeners).toHaveLength(1);
  });

  it('реагирует только на scope="app" и на увеличение revision', async () => {
    const listeners: Array<(event: any) => Promise<void>> = [];
    listenMock.mockImplementation(async (_event: string, handler: any) => {
      listeners.push(handler);
      return () => {};
    });

    let currentRevision = 1;
    let currentHotkey = 'A';
    invokeMock.mockImplementation(async (cmd: string) => {
      if (cmd !== 'get_app_config_snapshot') throw new Error('unexpected command');
      return { revision: currentRevision, config: { recording_hotkey: currentHotkey } };
    });

    const store = useAppConfigStore();
    await store.startSync();
    expect(store.revision).toBe(1);
    expect(store.recordingHotkey).toBe('A');
    expect(invokeMock).toHaveBeenCalledTimes(1);

    // Старый revision — игнор
    currentRevision = 1;
    currentHotkey = 'B';
    await listeners[0]({ payload: { revision: 1, scope: 'app' } });
    expect(invokeMock).toHaveBeenCalledTimes(1);
    expect(store.recordingHotkey).toBe('A');

    // scope не app — игнор
    currentRevision = 2;
    currentHotkey = 'C';
    await listeners[0]({ payload: { revision: 2, scope: 'stt' } });
    expect(invokeMock).toHaveBeenCalledTimes(1);
    expect(store.recordingHotkey).toBe('A');

    // Новая ревизия + app — обновление
    await listeners[0]({ payload: { revision: 2, scope: 'app' } });
    expect(invokeMock).toHaveBeenCalledTimes(2);
    expect(store.revision).toBe(2);
    expect(store.recordingHotkey).toBe('C');
  });

  it('e2e (модель): два окна получают одно и то же состояние после события', async () => {
    const listeners: Array<(event: any) => Promise<void>> = [];
    listenMock.mockImplementation(async (_event: string, handler: any) => {
      listeners.push(handler);
      return () => {};
    });

    let currentRevision = 10;
    let currentConfig = { recording_hotkey: 'X' };
    invokeMock.mockImplementation(async (cmd: string) => {
      if (cmd !== 'get_app_config_snapshot') throw new Error('unexpected command');
      return { revision: currentRevision, config: currentConfig };
    });

    const piniaA = createPinia();
    const piniaB = createPinia();
    const storeA = useAppConfigStore(piniaA);
    const storeB = useAppConfigStore(piniaB);

    await storeA.startSync();
    await storeB.startSync();

    expect(storeA.revision).toBe(10);
    expect(storeB.revision).toBe(10);
    expect(storeA.recordingHotkey).toBe('X');
    expect(storeB.recordingHotkey).toBe('X');

    // Меняем "бэкенд" и шлём событие
    currentRevision = 11;
    currentConfig = { recording_hotkey: 'Y' };
    await Promise.all(
      listeners.map((fn) => fn({ payload: { revision: 11, scope: 'app' } }))
    );

    expect(storeA.revision).toBe(11);
    expect(storeB.revision).toBe(11);
    expect(storeA.recordingHotkey).toBe('Y');
    expect(storeB.recordingHotkey).toBe('Y');
  });
});

