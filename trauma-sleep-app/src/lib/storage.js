const API_KEY_SESSION = 'ts_api_key';
const LIBRARY_KEY = 'ts_library';
const MODEL_PREFS_KEY = 'ts_model_prefs';

export function saveApiKey(key) {
  sessionStorage.setItem(API_KEY_SESSION, key);
}

export function loadApiKey() {
  return sessionStorage.getItem(API_KEY_SESSION) || '';
}

export function clearApiKey() {
  sessionStorage.removeItem(API_KEY_SESSION);
}

function reviveUrl(entry) {
  if (!entry.audioB64) return entry;
  try {
    const binary = atob(entry.audioB64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    return { ...entry, url: URL.createObjectURL(blob) };
  } catch {
    return entry;
  }
}

export function loadLibrary() {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    return entries.map(reviveUrl);
  } catch {
    return [];
  }
}

export function saveToLibrary(entry) {
  const { url: _url, blob: _blob, ...storable } = entry;
  const raw = localStorage.getItem(LIBRARY_KEY);
  const existing = raw ? JSON.parse(raw) : [];
  const updated = [storable, ...existing].slice(0, 50);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));
  return [entry, ...existing.map(reviveUrl)].slice(0, 50);
}

export function deleteFromLibrary(id) {
  const raw = localStorage.getItem(LIBRARY_KEY);
  const existing = raw ? JSON.parse(raw) : [];
  const updated = existing.filter((e) => e.id !== id);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));
  return updated.map(reviveUrl);
}

export function clearLibrary() {
  localStorage.removeItem(LIBRARY_KEY);
}

export function loadModelPrefs() {
  try {
    const raw = localStorage.getItem(MODEL_PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveModelPrefs(prefs) {
  const prev = loadModelPrefs();
  localStorage.setItem(MODEL_PREFS_KEY, JSON.stringify({ ...prev, ...prefs }));
}
