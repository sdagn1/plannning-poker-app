/**
 * Backend connection configuration.
 *
 * The WebSocket base URL can be overridden at build time via the
 * `VITE_BACKEND_WS_URL` environment variable; otherwise the deployed
 * backend is used per the API contract.
 */
export const BACKEND_WS_URL =
  import.meta.env.VITE_BACKEND_WS_URL ??
  'wss://planning-poker-backend-ymq7.onrender.com';

/** Build the room WebSocket URL for a given room id and display name. */
export function buildRoomSocketUrl(roomId: string, displayName: string): string {
  const params = new URLSearchParams({ room: roomId, name: displayName });
  return `${BACKEND_WS_URL}/ws?${params.toString()}`;
}
