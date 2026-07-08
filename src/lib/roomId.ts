/**
 * Room identifier generation and validation.
 *
 * Room ids are generated entirely on the frontend and must match the backend
 * slug contract: `^[a-z0-9]{4,32}(-[a-z0-9]{4,32})*$`, total length <= 128.
 */

export const ROOM_ID_PATTERN = /^[a-z0-9]{4,32}(-[a-z0-9]{4,32})*$/;
export const ROOM_ID_MAX_LENGTH = 128;

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SEGMENT_LENGTH = 4;
const SEGMENT_COUNT = 2;

/** Pick `count` random values from the alphabet using a CSPRNG. */
function randomChars(count: number): string {
  const values = new Uint32Array(count);
  crypto.getRandomValues(values);
  let result = '';
  for (let i = 0; i < count; i++) {
    result += ALPHABET[values[i] % ALPHABET.length];
  }
  return result;
}

/**
 * Generate a unique, shareable room id (e.g. `xk29-4plm`) that satisfies
 * {@link ROOM_ID_PATTERN}.
 */
export function generateRoomId(): string {
  const segments: string[] = [];
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    segments.push(randomChars(SEGMENT_LENGTH));
  }
  return segments.join('-');
}

/** Whether a string is a valid room id per the backend contract. */
export function isValidRoomId(roomId: string): boolean {
  return roomId.length <= ROOM_ID_MAX_LENGTH && ROOM_ID_PATTERN.test(roomId);
}
