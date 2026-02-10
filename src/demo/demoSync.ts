import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import type { RevisionSyncHandle, SnapshotEnvelope } from '@statesync/core';
import { createTauriRevisionSync } from '@statesync/tauri';

import { STATE_SYNC_INVALIDATION_EVENT } from '../windowing/stateSync/tauri';
import type { useDemoStore } from './demoStore';

interface DemoSnapshotData {
  counter: number;
  color: string;
  sliderValue: number;
  text: string;
}

export function createDemoSync(
  store: ReturnType<typeof useDemoStore>,
): RevisionSyncHandle {
  return createTauriRevisionSync<DemoSnapshotData>({
    topic: 'demo',
    listen,
    invoke,
    eventName: STATE_SYNC_INVALIDATION_EVENT,
    commandName: 'get_demo_snapshot',
    applier: {
      apply(snapshot: SnapshotEnvelope<DemoSnapshotData>) {
        store.applySnapshot(snapshot.data);
        store.revision = snapshot.revision;
      },
    },
    onError: (ctx) => {
      console.error(`[demo-sync] error (${ctx.phase}):`, ctx.error);
    },
  });
}

export async function updateDemoState(
  patch: Partial<DemoSnapshotData>,
): Promise<void> {
  await invoke('update_demo_state', patch);
}
