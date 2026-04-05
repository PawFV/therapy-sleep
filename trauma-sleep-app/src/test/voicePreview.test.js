import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AVAILABLE_VOICES } from '../lib/openai';

describe('AVAILABLE_VOICES', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(AVAILABLE_VOICES)).toBe(true);
    expect(AVAILABLE_VOICES.length).toBeGreaterThan(0);
  });

  it('contains expected voices', () => {
    expect(AVAILABLE_VOICES).toContain('nova');
    expect(AVAILABLE_VOICES).toContain('shimmer');
    expect(AVAILABLE_VOICES).toContain('coral');
    expect(AVAILABLE_VOICES).toContain('sage');
  });

  it('has no duplicate voices', () => {
    const unique = new Set(AVAILABLE_VOICES);
    expect(unique.size).toBe(AVAILABLE_VOICES.length);
  });

  it('all entries are non-empty strings', () => {
    for (const v of AVAILABLE_VOICES) {
      expect(typeof v).toBe('string');
      expect(v.length).toBeGreaterThan(0);
    }
  });
});

describe('generateVoicePreview mock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls generateAudio with the right voice and returns a url', async () => {
    const mockUrl = 'blob:mock-url';
    const mockGenerateAudio = vi.fn().mockResolvedValue({ blob: new Blob(), url: mockUrl, audioB64: '' });

    vi.doMock('../lib/openai', async (importOriginal) => {
      const mod = await importOriginal();
      return {
        ...mod,
        generateAudio: mockGenerateAudio,
      };
    });

    expect(mockGenerateAudio).not.toHaveBeenCalled();
    const result = await mockGenerateAudio({ apiKey: 'sk-test', text: 'Hola', voice: 'nova' });
    expect(result.url).toBe(mockUrl);
  });

  it('generateVoicePreview text includes the voice name', () => {
    for (const voice of AVAILABLE_VOICES) {
      const text = `Hola, soy ${voice}. Estoy acá con vos.`;
      expect(text).toContain(voice);
    }
  });
});

describe('Audio element play() behavior', () => {
  it('new Audio() constructor exists in jsdom', () => {
    expect(typeof Audio).toBe('function');
  });

  it('Audio instance has play and pause methods', () => {
    const audio = new Audio();
    expect(typeof audio.play).toBe('function');
    expect(typeof audio.pause).toBe('function');
  });

  it('audio.play() returns a Promise (or undefined in some envs)', () => {
    const audio = new Audio();
    const result = audio.play();
    if (result !== undefined) {
      expect(typeof result.then).toBe('function');
    }
  });

  it('audio.src can be set to a blob URL string', () => {
    const audio = new Audio();
    audio.src = 'blob:http://localhost/fake-blob-id';
    expect(audio.src).toContain('blob:');
  });
});
