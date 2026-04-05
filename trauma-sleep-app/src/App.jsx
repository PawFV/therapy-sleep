import { useState } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import HeaderSelector from './components/HeaderSelector';
import ParameterSliders from './components/ParameterSliders';
import AudioPlayer from './components/AudioPlayer';
import Library from './components/Library';
import PlaylistPlayer from './components/PlaylistPlayer';
import { generateFull, generateImage } from './lib/openai';
import ModelSelector from './components/ModelSelector';
import { MODEL_TEXT, MODEL_AUDIO, MODEL_IMAGE } from './lib/openai';
import { loadApiKey, loadLibrary, saveToLibrary, deleteFromLibrary, clearLibrary, loadModelPrefs, saveModelPrefs } from './lib/storage';
import { t } from './lib/i18n';

const DEFAULT_PARAMS = {
  warmth: 5,
  closeness: 5,
  pace: 4,
  voice: 'nova',
  context: '',
  duration: 2,
  textModel: MODEL_TEXT,
  audioModel: MODEL_AUDIO,
  imageModel: MODEL_IMAGE,
};

function buildInitialParams() {
  const saved = loadModelPrefs();
  return {
    ...DEFAULT_PARAMS,
    ...(saved.textModel && { textModel: saved.textModel }),
    ...(saved.audioModel && { audioModel: saved.audioModel }),
    ...(saved.imageModel && { imageModel: saved.imageModel }),
  };
}

function loadLang() {
  return localStorage.getItem('ts_lang') || 'en';
}

export default function App() {
  const [lang, setLang] = useState(loadLang);
  const [apiKey, setApiKey] = useState(loadApiKey());
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [params, setParams] = useState(buildInitialParams);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [tokenUsage, setTokenUsage] = useState(null);
  const [error, setError] = useState('');
  const [library, setLibrary] = useState(loadLibrary());
  const [tab, setTab] = useState('generate');
  const [playlist, setPlaylist] = useState([]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  function toggleLang() {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    localStorage.setItem('ts_lang', next);
  }

  const T = (key, ...args) => t(lang, key, ...args);

  async function handleGenerate() {
    if (!apiKey || !selectedHeader) return;
    setStatus('loading');
    setError('');
    setResult(null);
    setTokenUsage(null);

    try {
      const [audioResult, imageDataUrl] = await Promise.allSettled([
        generateFull({
          apiKey,
          header: selectedHeader,
          params,
          context: params.context,
          onProgress: (stage, detail) => {
            if (stage === 'text') {
              setProgress(T('generateScript'));
            } else if (stage === 'audio' && detail?.total) {
              setProgress(`Audio ${detail.current}/${detail.total}...`);
            } else {
              setProgress(T('synthesizingAudio'));
            }
          },
        }),
        generateImage({
          apiKey,
          header: selectedHeader,
          context: params.context,
          imageModel: params.imageModel,
        }),
      ]);

      if (audioResult.status === 'rejected') throw audioResult.reason;

      const { text, blob, url, audioB64, usage } = audioResult.value;
      const imageUrl = imageDataUrl.status === 'fulfilled' ? imageDataUrl.value : null;

      const entry = {
        id: `${selectedHeader.id}_${Date.now()}`,
        headerId: selectedHeader.id,
        icon: selectedHeader.icon,
        text,
        url,
        blob,
        audioB64,
        imageUrl,
        date: new Date().toLocaleString(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'short', timeStyle: 'short' }),
      };

      const updated = saveToLibrary(entry);
      setLibrary(updated);
      setResult(entry);
      setTokenUsage(usage ?? null);
      setStatus('done');
    } catch (e) {
      setError(e.message || T('apiKeyError'));
      setStatus('error');
    }
  }

  function handleDownload() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${result.id}.mp3`;
    a.click();
  }

  function handleDeleteFromLibrary(id) {
    setLibrary(deleteFromLibrary(id));
  }

  function handleClearLibrary() {
    clearLibrary();
    setLibrary([]);
  }

  function addToPlaylist(entry) {
    setPlaylist((prev) => {
      if (prev.some((e) => e.id === entry.id)) return prev;
      return [...prev, entry];
    });
  }

  function removeFromPlaylist(id) {
    setPlaylist((prev) => prev.filter((e) => e.id !== id));
  }

  const canGenerate = !!apiKey && !!selectedHeader && status !== 'loading';
  const headerLabel = selectedHeader ? T(`header.${selectedHeader.id}.label`) : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">

        <header className="text-center space-y-2 relative">
          <button
            onClick={toggleLang}
            className="absolute right-0 top-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            trauma<span className="text-indigo-400">sleep</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            {T('tagline')}
          </p>
        </header>

        <div className="space-y-6 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-5">
          <ApiKeyInput apiKey={apiKey} onKeySet={setApiKey} lang={lang} />
          <ModelSelector
            textModel={params.textModel}
            audioModel={params.audioModel}
            imageModel={params.imageModel}
            lang={lang}
            onChange={(patch) => {
              setParams((p) => ({ ...p, ...patch }));
              saveModelPrefs(patch);
            }}
          />
        </div>

        <div className="flex gap-1 bg-slate-900 rounded-xl p-1">
          <button
            onClick={() => setTab('generate')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'generate' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {T('tabGenerate')}
          </button>
          <button
            onClick={() => setTab('library')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'library' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {T('tabLibrary')} {library.length > 0 && <span className="text-indigo-400 ml-1">{library.length}</span>}
          </button>
        </div>

        {tab === 'generate' && (
          <div className="space-y-8">
            {!apiKey && (
              <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl px-5 py-4 text-sm text-amber-400">
                {T('apiKeyRequired')}
              </div>
            )}

            <HeaderSelector selected={selectedHeader} onSelect={setSelectedHeader} lang={lang} />

            {selectedHeader && (
              <ParameterSliders params={params} onChange={setParams} apiKey={apiKey} lang={lang} />
            )}

            {selectedHeader && apiKey && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-3 min-h-[3.5rem]"
              >
                {status === 'loading' && (
                  <svg className="h-5 w-5 shrink-0 animate-spin text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <span className="text-center leading-snug">
                  {status === 'loading'
                    ? progress || T('generating')
                    : T('generateBtn', headerLabel)}
                </span>
              </button>
            )}

            {error && (
              <div className="bg-red-950/40 border border-red-800/40 rounded-2xl px-5 py-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {result && status === 'done' && (
              <div className="space-y-3">
                {result.imageUrl && (
                  <div
                    className="relative group rounded-2xl overflow-hidden border border-slate-700/60 cursor-zoom-in"
                    onClick={() => setLightboxImg(result.imageUrl)}
                  >
                    <img
                      src={result.imageUrl}
                      alt={headerLabel}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-2.5 3.5L17 17" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs text-slate-500">{T('resultSaved')}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {tokenUsage && (
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span><span className="text-slate-500">{T('tokensIn')}</span> <span className="text-indigo-400 font-mono">{tokenUsage.prompt_tokens}</span></span>
                        <span><span className="text-slate-500">{T('tokensOut')}</span> <span className="text-indigo-400 font-mono">{tokenUsage.completion_tokens}</span></span>
                        <span><span className="text-slate-500">{T('tokensTotal')}</span> <span className="text-indigo-400 font-mono">{tokenUsage.total_tokens}</span></span>
                      </div>
                    )}
                    <button
                      onClick={() => addToPlaylist(result)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        playlist.some((e) => e.id === result.id)
                          ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50'
                          : 'bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white border border-slate-700'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      {playlist.some((e) => e.id === result.id) ? T('inPlaylist') : T('addToPlaylist')}
                    </button>
                  </div>
                </div>
                <AudioPlayer
                  url={result.url}
                  title={headerLabel}
                  text={result.text}
                  onDownload={handleDownload}
                  defaultShowText
                  lang={lang}
                />
              </div>
            )}
          </div>
        )}

        {tab === 'library' && (
          <Library
            entries={library}
            playlist={playlist}
            onDelete={handleDeleteFromLibrary}
            onClear={handleClearLibrary}
            onAddToPlaylist={addToPlaylist}
            onRemoveFromPlaylist={removeFromPlaylist}
            lang={lang}
          />
        )}

        <footer className="text-center text-xs text-slate-700 pb-4">
          {T('footer')}
        </footer>
      </div>

      {playlist.length > 0 && !showPlaylist && (
        <button
          onClick={() => setShowPlaylist(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl shadow-indigo-900/40 transition-all z-40"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          {T('playlistBtn')} <span className="bg-white/20 rounded-lg px-1.5 py-0.5 text-xs">{playlist.length}</span>
        </button>
      )}

      {showPlaylist && playlist.length > 0 && (
        <PlaylistPlayer
          entries={playlist}
          onClose={() => setShowPlaylist(false)}
          onRemove={removeFromPlaylist}
          lang={lang}
        />
      )}

      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <a
            href={lightboxImg}
            download="therapeutic-image.png"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 text-white/70 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {T('downloadImage')}
          </a>
          <img
            src={lightboxImg}
            alt={T('lightboxAlt')}
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
