import { expect } from 'expect-webdriverio';

async function ensureE2E() {
  await browser.execute(() => {
    if (!window.__E2E__) throw new Error('__E2E__ is not installed');
  });
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

describe('multi-window sync (burst updates)', () => {
  it('multiple rapid updates converge to the latest state in both windows', async () => {
    await ensureE2E();

    // Открываем settings окно.
    const settingsButton = await $('[data-testid="open-settings"]');
    await settingsButton.waitForExist({ timeout: 15000 });
    await settingsButton.click();

    const handles = await browser.getWindowHandles();
    expect(handles.length).toBeGreaterThanOrEqual(2);

    const mainHandle = handles[0];
    const settingsHandle = handles[1];

    await browser.switchToWindow(settingsHandle);
    await ensureE2E();

    // Burst updates: шлём несколько апдейтов подряд.
    const res1 = await invoke('update_app_config', { auto_copy_to_clipboard: false });
    if (res1 && res1.__error) throw new Error(res1.__error);
    const res2 = await invoke('update_app_config', { auto_copy_to_clipboard: true });
    if (res2 && res2.__error) throw new Error(res2.__error);

    const res3 = await invoke('update_ui_preferences', { theme: 'dark', locale: 'ru' });
    if (res3 && res3.__error) throw new Error(res3.__error);
    const res4 = await invoke('update_ui_preferences', { theme: 'light', locale: 'en' });
    if (res4 && res4.__error) throw new Error(res4.__error);

    const res5 = await invoke('update_stt_config', {
      provider: 'backend',
      language: 'ru',
      deepgram_api_key: null,
      assemblyai_api_key: null,
      model: null,
    });
    if (res5 && res5.__error) throw new Error(res5.__error);
    const res6 = await invoke('update_stt_config', {
      provider: 'backend',
      language: 'en',
      deepgram_api_key: null,
      assemblyai_api_key: null,
      model: null,
    });
    if (res6 && res6.__error) throw new Error(res6.__error);

    // Проверяем, что main окно сошлось к последним значениям.
    await browser.switchToWindow(mainHandle);
    await ensureE2E();

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

