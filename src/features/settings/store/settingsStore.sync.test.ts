import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSettingsStore } from './settingsStore';

const emitMock = vi.fn();
const getCurrentWindowMock = vi.fn();

vi.mock('@tauri-apps/api/event', () => ({
  emit: (...args: any[]) => emitMock(...args),
}));

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => getCurrentWindowMock(),
}));

describe('settingsStore cross-window UI events', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    (window as any).__TAURI__ = {};
    emitMock.mockReset();
    getCurrentWindowMock.mockReset();
    getCurrentWindowMock.mockReturnValue({ label: 'settings' });
    localStorage.clear();
  });

  it('setTheme emits ui:theme-changed in Tauri environment', () => {
    const store = useSettingsStore();
    store.setTheme('light');

    expect(localStorage.getItem('uiTheme')).toBe('light');
    expect(emitMock).toHaveBeenCalledWith('ui:theme-changed', {
      theme: 'light',
      sourceWindow: 'settings',
    });
  });
});

