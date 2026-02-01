import { expect } from 'expect-webdriverio';

async function getE2E() {
  return await browser.execute(() => {
    if (!window.__E2E__) throw new Error('__E2E__ is not installed');
    return true;
  });
}

async function getWindowLabel() {
  return await browser.execute(() => window.__E2E__.getWindowLabel());
}

async function invoke(command, args) {
  return await browser.executeAsync((cmd, a, done) => {
    window.__E2E__
      .invoke(cmd, a)
      .then((res) => done(res))
      .catch((err) => done({ __error: String(err) }));
  }, command, args);
}

async function waitFor(fn, { timeoutMs = 15_000, intervalMs = 200 } = {}) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ok = await fn();
    if (ok) return;
    if (Date.now() - start > timeoutMs) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

describe('multi-window sync (real tauri webdriver)', () => {
  it('opens settings window and syncs ui-preferences + app-config + stt-config to main', async () => {
    await getE2E();
    expect(await getWindowLabel()).toBe('main');

    // Открываем settings окно (2-й webview)
    const settingsButton = await $('[data-testid="open-settings"]');
    await settingsButton.waitForExist({ timeout: 15000 });
    await settingsButton.click();

    const handles = await browser.getWindowHandles();
    expect(handles.length).toBeGreaterThanOrEqual(2);

    const mainHandle = handles[0];
    const settingsHandle = handles[1];

    // Переключаемся на settings окно
    await browser.switchToWindow(settingsHandle);
    await getE2E();
    expect(await getWindowLabel()).toBe('settings');

    // 1) ui-preferences: меняем тему/локаль
    const uiRes = await invoke('update_ui_preferences', { theme: 'light', locale: 'en' });
    if (uiRes && uiRes.__error) throw new Error(uiRes.__error);

    // 2) app-config: меняем авто-копирование
    const appRes = await invoke('update_app_config', { auto_copy_to_clipboard: true });
    if (appRes && appRes.__error) throw new Error(appRes.__error);

    // 3) stt-config: меняем язык
    const sttRes = await invoke('update_stt_config', {
      provider: 'backend',
      language: 'en',
      deepgram_api_key: null,
      assemblyai_api_key: null,
      model: null,
    });
    if (sttRes && sttRes.__error) throw new Error(sttRes.__error);

    // Проверяем, что main окно подтянуло изменения
    await browser.switchToWindow(mainHandle);
    await getE2E();

    await waitFor(async () => {
      const prefs = await browser.execute(() => window.__E2E__.getUiPrefs());
      return prefs.isLight === true && prefs.locale === 'en';
    });

    await waitFor(async () => {
      const cfg = await browser.execute(() => window.__E2E__.getAppConfig());
      return cfg.autoCopyToClipboard === true;
    });

    await waitFor(async () => {
      const cfg = await browser.execute(() => window.__E2E__.getSttConfig());
      return cfg.language === 'en';
    });
  });
});

