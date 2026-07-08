/** Configurable mock WebSocket for tests. */
export type MockBehaviour = 'open' | 'fail';

export class MockWebSocket {
  static instances: MockWebSocket[] = [];
  static behaviour: MockBehaviour = 'open';
  /**
   * When true (default), an opened socket auto-emits a `welcome` + `state`
   * that makes the connecting user the sole host. Set false to drive the
   * messages manually (e.g. joining a room with an existing host).
   */
  static autoWelcome = true;

  static reset() {
    MockWebSocket.instances = [];
    MockWebSocket.behaviour = 'open';
    MockWebSocket.autoWelcome = true;
  }

  onopen: ((event: unknown) => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onclose: ((event: unknown) => void) | null = null;
  readyState = 0;
  url: string;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
    queueMicrotask(() => {
      if (MockWebSocket.behaviour === 'fail') {
        this.readyState = 3;
        this.onerror?.(new Event('error'));
        this.onclose?.(new Event('close'));
        return;
      }
      this.readyState = 1;
      this.onopen?.(new Event('open'));
      if (!MockWebSocket.autoWelcome) return;
      const name =
        new URL(this.url).searchParams.get('name') ?? 'Unknown Pilot';
      const userId = 'user-host';
      this.emit({ type: 'welcome', userId });
      this.emit({
        type: 'state',
        hostId: userId,
        revealed: false,
        users: [{ id: userId, name, hasVoted: false }],
        votes: null,
      });
    });
  }

  emit(payload: unknown) {
    this.onmessage?.({ data: JSON.stringify(payload) });
  }

  send() {}

  close() {
    this.readyState = 3;
  }
}
