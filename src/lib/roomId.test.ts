import { describe, it, expect } from 'vitest';
import {
  generateRoomId,
  isValidRoomId,
  parseJoinRoomId,
  ROOM_ID_PATTERN,
  ROOM_ID_MAX_LENGTH,
} from '../lib/roomId.ts';

describe('generateRoomId', () => {
  it('produces ids matching the backend slug pattern', () => {
    for (let i = 0; i < 200; i++) {
      const id = generateRoomId();
      expect(id).toMatch(ROOM_ID_PATTERN);
      expect(id.length).toBeLessThanOrEqual(ROOM_ID_MAX_LENGTH);
    }
  });

  it('produces ids that pass isValidRoomId', () => {
    expect(isValidRoomId(generateRoomId())).toBe(true);
  });

  it('is highly unlikely to collide', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i++) ids.add(generateRoomId());
    // Allow for the astronomically small chance of a collision.
    expect(ids.size).toBeGreaterThan(995);
  });
});

describe('isValidRoomId', () => {
  it('accepts valid slugs', () => {
    expect(isValidRoomId('xk29-4plm')).toBe(true);
    expect(isValidRoomId('abcd')).toBe(true);
    expect(isValidRoomId('room-1234-5678')).toBe(true);
  });

  it('rejects invalid slugs', () => {
    expect(isValidRoomId('abc')).toBe(false); // segment too short
    expect(isValidRoomId('AB12-cdef')).toBe(false); // uppercase
    expect(isValidRoomId('room--1234')).toBe(false); // double dash
    expect(isValidRoomId('room_1234')).toBe(false); // underscore
    expect(isValidRoomId('-abcd')).toBe(false); // leading dash
    expect(isValidRoomId('a'.repeat(ROOM_ID_MAX_LENGTH + 1))).toBe(false);
  });
});

describe('parseJoinRoomId', () => {
  it('returns the room id from a valid shared link', () => {
    expect(parseJoinRoomId('xk29-4plm')).toBe('xk29-4plm');
  });

  it('returns null for a missing room id', () => {
    expect(parseJoinRoomId(undefined)).toBeNull();
    expect(parseJoinRoomId(null)).toBeNull();
  });

  it('returns null for a malformed room id', () => {
    expect(parseJoinRoomId('AB12-cdef')).toBeNull(); // uppercase
    expect(parseJoinRoomId('room_1234')).toBeNull(); // underscore
    expect(parseJoinRoomId('abc')).toBeNull(); // segment too short
  });
});
