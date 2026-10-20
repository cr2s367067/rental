import { test, expect } from 'bun:test';
import { formatTWD } from '../Models/money';
test('whole TWD display preserves every integer digit without float arithmetic', () => {
  expect(formatTWD('999999999999')).toBe('TWD 999,999,999,999');
  expect(formatTWD('0')).toBe('TWD 0');
});
