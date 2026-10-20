import { test, expect } from 'bun:test';
import { ForbiddenException } from '@nestjs/common';
import { checkCSRF } from '../../Src/Infrastructure/transport';
import { validatedFile } from '../../Managers/document-rules';
test('non-ASCII incorrect CSRF token is403 rather than a byte-length exception', () => {
  expect(() => checkCSRF('é'.repeat(6), 'secret')).toThrow(ForbiddenException);
});
test('a whitespace-only filename is rejected as unusable metadata', () => {
  expect(() =>
    validatedFile({ bytes: Buffer.from('synthetic'), mime_type: 'text/plain', file_name: '   ' }),
  ).toThrow();
});
