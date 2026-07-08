import { useSyncExternalStore } from 'react';
import { roomConnection, type RoomSnapshot } from './roomConnection.ts';

/** Subscribe to the active room connection snapshot. */
export function useRoomConnection(): RoomSnapshot {
  return useSyncExternalStore(
    roomConnection.subscribe,
    roomConnection.getSnapshot,
  );
}
