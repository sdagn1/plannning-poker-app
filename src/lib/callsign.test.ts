import { describe, it, expect } from 'vitest';
import {
  validateCallsign,
  resolveCallsign,
  randomStarWarsCallsign,
  STAR_WARS_CALLSIGNS,
  CALLSIGN_MAX_LENGTH,
} from '../lib/callsign.ts';

describe('validateCallsign', () => {
  it('treats an empty callsign as valid (fallback applies)', () => {
    expect(validateCallsign('')).toEqual({ valid: true });
    expect(validateCallsign('   ')).toEqual({ valid: true });
  });

  it('accepts a callsign at the maximum length', () => {
    expect(validateCallsign('a'.repeat(CALLSIGN_MAX_LENGTH))).toEqual({
      valid: true,
    });
  });

  it('rejects a callsign longer than the maximum after trimming', () => {
    expect(validateCallsign('a'.repeat(CALLSIGN_MAX_LENGTH + 1))).toEqual({
      valid: false,
      error: 'too_long',
    });
  });

  it('ignores surrounding whitespace when measuring length', () => {
    const padded = `  ${'a'.repeat(CALLSIGN_MAX_LENGTH)}  `;
    expect(validateCallsign(padded)).toEqual({ valid: true });
  });
});

describe('resolveCallsign', () => {
  it('returns the trimmed callsign when provided', () => {
    expect(resolveCallsign('  Vader  ')).toBe('Vader');
  });

  it('falls back to a Star Wars callsign when empty', () => {
    const resolved = resolveCallsign('   ');
    expect(STAR_WARS_CALLSIGNS).toContain(resolved);
  });
});

describe('randomStarWarsCallsign', () => {
  it('always returns a value from the curated list within the length limit', () => {
    for (let i = 0; i < 100; i++) {
      const callsign = randomStarWarsCallsign();
      expect(STAR_WARS_CALLSIGNS).toContain(callsign);
      expect(callsign.length).toBeLessThanOrEqual(CALLSIGN_MAX_LENGTH);
    }
  });
});
