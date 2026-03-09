import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSettingsStore } from './settingsStore';

const invokeMock = vi.fn();

vi.mock('@tauri-apps/api/core', () => ({
  invoke: (...args: any[]) => invokeMock(...args),
}));

describe('settingsStore deepgramKeyterms persistence (debounced)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    (window as any).__TAURI__ = {};
    localStorage.clear();
    invokeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('setDeepgramKeyterms меняет только draft и не вызывает backend write', () => {
    const store = useSettingsStore();

    store.setDeepgramKeyterms('Kubernetes, VoicetextAI');
    expect(store.deepgramKeyterms).toBe('Kubernetes, VoicetextAI');
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it('setMicrophoneSensitivity меняет только draft и не вызывает backend write', () => {
    const store = useSettingsStore();

    store.setMicrophoneSensitivity(175);
    expect(store.microphoneSensitivity).toBe(175);
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it('capturePersistedState сохраняет baseline для save-only сравнения', () => {
    const store = useSettingsStore();

    store.setLanguage('ru', { persist: false });
    store.setMicrophoneSensitivity(100, { persist: false });
    store.setDeepgramKeyterms('Deepgram', { persist: false });
    store.capturePersistedState();

    store.setMicrophoneSensitivity(175);
    store.setDeepgramKeyterms('Kubernetes, VoicetextAI');

    const persisted = store.getPersistedState();
    expect(persisted?.microphoneSensitivity).toBe(100);
    expect(persisted?.deepgramKeyterms).toBe('Deepgram');
    expect(store.microphoneSensitivity).toBe(175);
    expect(store.deepgramKeyterms).toBe('Kubernetes, VoicetextAI');
  });
});

