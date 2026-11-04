import { describe, expect, it } from 'vitest';
import { readJsonBody, RequestJsonError } from './request-json';

describe('readJsonBody', () => {
  it('parses valid JSON within the byte limit', async () => {
    const request = new Request('https://example.test/api', {
      method: 'POST',
      body: JSON.stringify({ rating: 5 }),
    });
    await expect(readJsonBody(request, 100)).resolves.toEqual({ rating: 5 });
  });

  it('rejects a request exceeding its byte limit', async () => {
    const request = new Request('https://example.test/api', {
      method: 'POST',
      body: JSON.stringify({ text: 'x'.repeat(100) }),
    });
    await expect(readJsonBody(request, 20)).rejects.toMatchObject({ status: 413 });
  });

  it('rejects malformed JSON', async () => {
    const request = new Request('https://example.test/api', {
      method: 'POST',
      body: '{',
    });
    await expect(readJsonBody(request, 20)).rejects.toBeInstanceOf(RequestJsonError);
  });
});
