import { describe, it, expect } from 'vitest';
import { HEADERS } from '../lib/prompts';

describe('HEADERS structure', () => {
  it('exports 8 headers', () => {
    expect(HEADERS).toHaveLength(8);
  });

  it('each header has required fields', () => {
    for (const h of HEADERS) {
      expect(h).toHaveProperty('id');
      expect(h).toHaveProperty('label');
      expect(h).toHaveProperty('description');
      expect(h).toHaveProperty('icon');
      expect(typeof h.systemPrompt).toBe('function');
      expect(typeof h.userPrompt).toBe('function');
    }
  });

  it('all header ids are unique', () => {
    const ids = HEADERS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('systemPrompt generation', () => {
  const defaultParams = { warmth: 5, closeness: 5, pace: 4 };

  it('returns a non-empty string', () => {
    for (const h of HEADERS) {
      const prompt = h.systemPrompt(defaultParams);
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(50);
    }
  });

  it('adjusts tone based on warmth level', () => {
    const header = HEADERS[0];
    const cold = header.systemPrompt({ ...defaultParams, warmth: 1 });
    const warm = header.systemPrompt({ ...defaultParams, warmth: 10 });
    expect(cold).not.toBe(warm);
    expect(warm.toLowerCase()).toMatch(/c[aá]lid/);
  });

  it('adjusts closeness description', () => {
    const header = HEADERS[0];
    const formal = header.systemPrompt({ ...defaultParams, closeness: 1 });
    const intimate = header.systemPrompt({ ...defaultParams, closeness: 10 });
    expect(formal).toContain('profesional');
    expect(intimate).toContain('ntim');
  });
});

describe('userPrompt generation', () => {
  it('returns a non-empty string without context', () => {
    for (const h of HEADERS) {
      const prompt = h.userPrompt('');
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(20);
    }
  });

  it('includes context when provided', () => {
    const header = HEADERS[0];
    const prompt = header.userPrompt('Tengo mucho miedo esta noche');
    expect(prompt).toContain('Tengo mucho miedo esta noche');
  });

  it('does not include context placeholder when context is empty', () => {
    const header = HEADERS[0];
    const prompt = header.userPrompt('');
    expect(prompt).not.toContain('Contexto adicional:');
  });
});
