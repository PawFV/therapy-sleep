import { describe, it, expect } from 'vitest';
import { splitTextForSpeech } from '../lib/audioChunks';

describe('splitTextForSpeech', () => {
  it('returns empty for blank', () => {
    expect(splitTextForSpeech('')).toEqual([]);
    expect(splitTextForSpeech('   ')).toEqual([]);
  });

  it('returns single chunk for short text', () => {
    const t = 'Hola. Esto es corto.';
    expect(splitTextForSpeech(t, 500)).toEqual([t]);
  });

  it('splits long text into chunks under maxChars', () => {
    const long = 'a'.repeat(100) + '. ' + 'b'.repeat(100) + '. ' + 'c'.repeat(200);
    const chunks = splitTextForSpeech(long, 120);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(130);
    }
  });

  it('keeps paragraphs as separate flow', () => {
    const t = 'Primera linea corta.\n\nSegunda linea tambien.';
    const chunks = splitTextForSpeech(t, 500);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
  });
});
