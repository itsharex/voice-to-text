/**
 * Синхронизация auth-session между окнами (Tauri).
 *
 * auth-session содержит access/refresh токены и expiry, и меняется даже когда
 * is_authenticated остаётся true (например, background refresh в Rust).
 *
 * Мы намеренно не "патчим" store напрямую тут, а делаем reconcile через `auth.initialize({ silent: true })`,
 * чтобы не дублировать доменную логику и корректно обновлять связанную UI state.
 */

import type { RevisionSyncHandle, SnapshotEnvelope } from '@statesync/core';
import type { TauriInvoke, TauriListen } from '@statesync/tauri';
import { createTauriRevisionSync } from '@statesync/tauri';

import { STATE_SYNC_INVALIDATION_EVENT, CMD_GET_AUTH_SESSION_SNAPSHOT } from './tauri';
import { TOPIC_AUTH_SESSION } from './topics';
import type { AuthSessionSnapshotData } from './contracts';

export interface CreateAuthSessionSyncOptions {
  listen: TauriListen;
  invoke: TauriInvoke;

  /** Локальный access token (из store) — чтобы не делать лишний reconcile. */
  getLocalAccessToken: () => string | null | undefined;

  /** Вызывается когда снапшот отличается от локального состояния. */
  onExternalAuthSession: (next: AuthSessionSnapshotData) => void;

  onError?: (ctx: { phase: string; error: unknown }) => void;
}

export function createAuthSessionSync(
  options: CreateAuthSessionSyncOptions,
): RevisionSyncHandle {
  const { listen, invoke, getLocalAccessToken, onExternalAuthSession, onError } = options;

  return createTauriRevisionSync<AuthSessionSnapshotData>({
    topic: TOPIC_AUTH_SESSION,
    listen,
    invoke,
    eventName: STATE_SYNC_INVALIDATION_EVENT,
    commandName: CMD_GET_AUTH_SESSION_SNAPSHOT,
    applier: {
      apply(snapshot: SnapshotEnvelope<AuthSessionSnapshotData>) {
        const nextToken = snapshot.data.session?.access_token ?? null;
        const localToken = getLocalAccessToken() ?? null;
        if (nextToken === localToken) return;
        onExternalAuthSession(snapshot.data);
      },
    },
    onError: (ctx) => {
      console.error(`[auth-session] sync error (${ctx.phase}):`, ctx.error);
      onError?.({ phase: ctx.phase, error: ctx.error });
    },
  });
}

