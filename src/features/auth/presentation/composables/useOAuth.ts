import { ref, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../store/authStore';
import { getAuthContainer } from '../../infrastructure/di/authContainer';
import { AuthError, AuthErrorCode } from '../../domain/errors';
import { useAuthState } from './useAuthState';
import type { UnsubscribeFn } from '../../application/ports/IDeepLinkListener';

const OAUTH_TIMEOUT_MS = 120000;

/**
 * Composable для OAuth авторизации
 */
export function useOAuth() {
  const { t } = useI18n();
  const store = useAuthStore();
  const container = getAuthContainer();
  const state = useAuthState();

  let unsubscribeDeepLink: UnsubscribeFn | null = null;
  let oauthTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // Для защиты от двойной обработки
  const lastProcessedCode = ref<string | null>(null);

  function handleError(e: unknown): void {
    if (e instanceof AuthError) {
      switch (e.code) {
        case AuthErrorCode.OAuthError:
          store.setError(t('auth.errors.oauthError'));
          break;
        case AuthErrorCode.OAuthAccountLinked:
          store.setError(t('auth.errors.oauthAccountLinked'));
          break;
        case AuthErrorCode.NetworkError:
          store.setError(t('auth.errors.networkError'));
          break;
        default:
          store.setError(e.message);
      }
    } else {
      store.setError(t('auth.errors.generic'));
    }
    store.setStatusError();
  }

  function clearOAuthTimeout(): void {
    if (oauthTimeoutId) {
      clearTimeout(oauthTimeoutId);
      oauthTimeoutId = null;
    }
  }

  function parseOAuthCallback(urlString: string): { exchangeCode?: string; error?: string } | null {
    let url: URL;
    try {
      url = new URL(urlString);
    } catch {
      return null;
    }

    const isOAuthCallback =
      url.host === 'oauth' ||
      url.pathname.startsWith('/oauth/callback') ||
      (url.host === 'oauth' && url.pathname === '/callback');

    if (!isOAuthCallback) {
      return null;
    }

    const params = new URLSearchParams(url.search);
    return {
      exchangeCode: params.get('exchange_code') || undefined,
      error: params.get('error') || undefined,
    };
  }

  async function handleDeepLink(urlString: string): Promise<void> {
    const result = parseOAuthCallback(urlString);
    if (!result) return;

    clearOAuthTimeout();

    if (result.error) {
      store.setError(t('auth.errors.googleError', { error: decodeURIComponent(result.error) }));
      store.setUnauthenticated();
      return;
    }

    if (result.exchangeCode) {
      // Защита от двойной обработки
      if (result.exchangeCode === lastProcessedCode.value) {
        return;
      }
      lastProcessedCode.value = result.exchangeCode;

      store.setLoading();

      try {
        const response = await container.exchangeOAuthCodeUseCase.execute({
          exchangeCode: result.exchangeCode,
        });
        store.setAuthenticated(response.session);
      } catch (e) {
        handleError(e);
      }
    }
  }

  async function startGoogleOAuth(): Promise<void> {
    store.setLoading();

    try {
      // Подписываемся на deep link события
      if (!unsubscribeDeepLink) {
        unsubscribeDeepLink = await container.deepLinkListener.subscribe(handleDeepLink);
      }

      await container.startGoogleOAuthUseCase.execute();

      // Timeout на случай если deep link не сработает
      clearOAuthTimeout();
      oauthTimeoutId = setTimeout(() => {
        if (store.isLoading) {
          store.setUnauthenticated();
        }
        oauthTimeoutId = null;
      }, OAUTH_TIMEOUT_MS);
    } catch (e) {
      handleError(e);
    }
  }

  function cancelOAuth(): void {
    clearOAuthTimeout();
    if (store.isLoading) {
      store.setUnauthenticated();
    }
  }

  function cleanup(): void {
    clearOAuthTimeout();
    if (unsubscribeDeepLink) {
      unsubscribeDeepLink();
      unsubscribeDeepLink = null;
    }
  }

  onUnmounted(cleanup);

  return {
    ...state,
    startGoogleOAuth,
    cancelOAuth,
    cleanup,
  };
}
