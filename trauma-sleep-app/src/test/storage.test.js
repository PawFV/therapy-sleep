import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveApiKey, loadApiKey, clearApiKey,
  loadLibrary, saveToLibrary, deleteFromLibrary, clearLibrary,
  loadModelPrefs, saveModelPrefs,
} from '../lib/storage';

function makeMockStorage() {
  let store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
}

const mockSession = makeMockStorage();
const mockLocal = makeMockStorage();

vi.stubGlobal('sessionStorage', mockSession);
vi.stubGlobal('localStorage', mockLocal);

beforeEach(() => {
  mockSession.clear();
  mockLocal.clear();
});

describe('API Key (sessionStorage)', () => {
  it('saves and loads the API key', () => {
    saveApiKey('sk-test-123');
    expect(loadApiKey()).toBe('sk-test-123');
  });

  it('returns empty string when no key is set', () => {
    expect(loadApiKey()).toBe('');
  });

  it('clears the API key', () => {
    saveApiKey('sk-test-123');
    clearApiKey();
    expect(loadApiKey()).toBe('');
  });
});

describe('Library (localStorage)', () => {
  const entry = (id = 'a1') => ({
    id,
    label: 'Test',
    icon: '🌙',
    text: 'Texto de prueba',
    url: 'blob:test',
    date: '01/01/25 00:00',
  });

  it('returns empty array when library is empty', () => {
    expect(loadLibrary()).toEqual([]);
  });

  it('saves an entry and returns it', () => {
    const updated = saveToLibrary(entry());
    expect(updated).toHaveLength(1);
    expect(updated[0].id).toBe('a1');
  });

  it('prepends new entries (most recent first)', () => {
    saveToLibrary(entry('first'));
    const updated = saveToLibrary(entry('second'));
    expect(updated[0].id).toBe('second');
    expect(updated[1].id).toBe('first');
  });

  it('caps library at 50 entries', () => {
    for (let i = 0; i < 55; i++) {
      saveToLibrary(entry(`e${i}`));
    }
    expect(loadLibrary()).toHaveLength(50);
  });

  it('deletes an entry by id', () => {
    saveToLibrary(entry('keep'));
    saveToLibrary(entry('delete_me'));
    const updated = deleteFromLibrary('delete_me');
    expect(updated.find((e) => e.id === 'delete_me')).toBeUndefined();
    expect(updated.find((e) => e.id === 'keep')).toBeDefined();
  });

  it('clears all entries', () => {
    saveToLibrary(entry('x'));
    clearLibrary();
    expect(loadLibrary()).toEqual([]);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('ts_library', 'not-valid-json{{{');
    expect(loadLibrary()).toEqual([]);
  });
});

describe('Model prefs (localStorage)', () => {
  it('returns empty object when unset', () => {
    expect(loadModelPrefs()).toEqual({});
  });

  it('merges on save', () => {
    saveModelPrefs({ textModel: 'gpt-4o' });
    saveModelPrefs({ audioModel: 'gpt-audio' });
    expect(loadModelPrefs()).toEqual({ textModel: 'gpt-4o', audioModel: 'gpt-audio' });
  });
});
