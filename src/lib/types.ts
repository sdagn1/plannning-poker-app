/** Server → client message shapes, per the backend API contract. */

export interface WelcomeMessage {
  type: 'welcome';
  userId: string;
}

export interface RoomUser {
  id: string;
  name: string;
  hasVoted: boolean;
}

export interface StateMessage {
  type: 'state';
  hostId: string;
  revealed: boolean;
  users: RoomUser[];
  votes: Record<string, string> | null;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
}

export type ServerMessage = WelcomeMessage | StateMessage | ErrorMessage;

export function parseServerMessage(data: string): ServerMessage | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    return null;
  }
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as { type?: unknown }).type !== 'string'
  ) {
    return null;
  }
  const message = parsed as ServerMessage;
  switch (message.type) {
    case 'welcome':
    case 'state':
    case 'error':
      return message;
    default:
      return null;
  }
}
