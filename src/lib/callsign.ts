/**
 * Callsign (display name) handling.
 *
 * A callsign is the display name shown to other participants. The backend
 * requires 1–32 characters after trimming. When the user leaves the field
 * blank we assign a random Star Wars themed callsign instead.
 */

export const CALLSIGN_MAX_LENGTH = 32;

/** Curated Star Wars Empire callsigns, each <= CALLSIGN_MAX_LENGTH chars. */
export const STAR_WARS_CALLSIGNS = [
  'Darth Vader',
  'Emperor Palpatine',
  'Boba Fett',
  'Grand Moff Tarkin',
  'Grand Admiral Thrawn',
  'Director Krennic',
  'Darth Maul',
  'Count Dooku',
  'Kylo Ren',
  'Captain Phasma',
  'General Hux',
  'Admiral Piett',
  'General Veers',
  'Darth Sidious',
  'The Grand Inquisitor',
] as const;

export type CallsignValidationError = 'too_long';

export interface CallsignValidationResult {
  valid: boolean;
  error?: CallsignValidationError;
}

/** Pick a random Star Wars callsign. */
export function randomStarWarsCallsign(): string {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  const index = values[0] % STAR_WARS_CALLSIGNS.length;
  return STAR_WARS_CALLSIGNS[index];
}

/**
 * Validate a raw callsign input. Empty input is valid because it triggers the
 * random-callsign fallback; only an over-length callsign is rejected.
 */
export function validateCallsign(raw: string): CallsignValidationResult {
  if (raw.trim().length > CALLSIGN_MAX_LENGTH) {
    return { valid: false, error: 'too_long' };
  }
  return { valid: true };
}

/**
 * Resolve the callsign to send to the backend: the trimmed input when present,
 * otherwise a random Star Wars callsign.
 *
 * Assumes the input has already passed {@link validateCallsign}.
 */
export function resolveCallsign(raw: string): string {
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : randomStarWarsCallsign();
}
