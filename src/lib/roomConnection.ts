/**
 * Room WebSocket connection store.
 *
 * A single active connection is held at module scope so that it survives the
 * client-side navigation from the landing screen into the room. Components
 * subscribe via {@link useRoomConnection}.
 */

import { buildRoomSocketUrl } from './config.ts';
import { parseServerMessage, type StateMessage } from './types.ts';

export type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'closed'
  | 'error';

export interface RoomSnapshot {
  roomId: string | null;
  displayName: string | null;
  status: ConnectionStatus;
  userId: string | null;
  state: StateMessage | null;
  lastError: string | null;
}

type Listener = () => void;

const IDLE_SNAPSHOT: RoomSnapshot = {
  roomId: null,
  displayName: null,
  status: 'idle',
  userId: null,
  state: null,
  lastError: null,
};

class RoomConnectionStore {
  private snapshot: RoomSnapshot = IDLE_SNAPSHOT;
  private socket: WebSocket | null = null;
  private listeners = new Set<Listener>();

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): RoomSnapshot => this.snapshot;

  private emit(patch: Partial<RoomSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Open a connection for the given room. Resolves once the socket is open,
   * rejects if the connection cannot be established.
   */
  connect(roomId: string, displayName: string): Promise<void> {
    this.closeSocket();
    this.snapshot = {
      ...IDLE_SNAPSHOT,
      roomId,
      displayName,
      status: 'connecting',
    };
    this.listeners.forEach((listener) => listener());

    return new Promise<void>((resolve, reject) => {
      let socket: WebSocket;
      try {
        socket = new WebSocket(buildRoomSocketUrl(roomId, displayName));
      } catch {
        this.emit({ status: 'error', lastError: 'connection_failed' });
        reject(new Error('connection_failed'));
        return;
      }
      this.socket = socket;
      let settled = false;

      socket.onopen = () => {
        settled = true;
        this.emit({ status: 'open' });
        resolve();
      };

      socket.onmessage = (event: MessageEvent) => {
        if (typeof event.data !== 'string') return;
        const message = parseServerMessage(event.data);
        if (!message) return;
        if (message.type === 'welcome') {
          this.emit({ userId: message.userId });
        } else if (message.type === 'state') {
          this.emit({ state: message });
        } else {
          this.emit({ lastError: message.message });
        }
      };

      socket.onerror = () => {
        if (!settled) {
          settled = true;
          this.emit({ status: 'error', lastError: 'connection_failed' });
          reject(new Error('connection_failed'));
        }
      };

      socket.onclose = () => {
        if (!settled) {
          settled = true;
          this.emit({ status: 'error', lastError: 'connection_failed' });
          reject(new Error('connection_failed'));
          return;
        }
        this.emit({ status: 'closed' });
      };
    });
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      try {
        this.socket.close();
      } catch {
        // ignore — socket may not be open yet
      }
      this.socket = null;
    }
  }

  reset(): void {
    this.closeSocket();
    this.snapshot = IDLE_SNAPSHOT;
    this.listeners.forEach((listener) => listener());
  }
}

export const roomConnection = new RoomConnectionStore();
