import { describe, expect, it } from 'vitest';
import { parseTmdbId } from './tmdb-id';

describe('parseTmdbId', () => {
  it('accepts positive safe integer IDs', () => {
    expect(parseTmdbId('123')).toBe(123);
  });

  it.each(['', '0', '-1', '1.2', '1e3', '999999999999999999999', 'abc'])(
    'rejects invalid IDs (%s)',
    (value) => {
      expect(parseTmdbId(value)).toBeNull();
    }
  );
});
