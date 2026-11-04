import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from './json-ld';

describe('serializeJsonLd', () => {
  it('escapes HTML script delimiters in untrusted strings', () => {
    const serialized = serializeJsonLd({ description: '</script><script>alert(1)</script>' });
    expect(serialized).not.toContain('</script>');
    expect(serialized).toContain('\\u003c/script>');
  });
});
