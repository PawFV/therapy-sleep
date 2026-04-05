import { useRef, useState, useEffect } from 'react';

function formatTime(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ url, title, text, onDownload, defaultShowText = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showText, setShowText] = useState(defaultShowText);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setLoadError(false);
  }, [url]);

  function togglePlay() {
    if (!audioRef.current || loadError) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setLoadError(true));
    }
    setPlaying(!playing);
  }

  function handleSeek(e) {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrent(val);
  }

  return (
    <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowText(!showText)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg hover:bg-slate-700"
          >
            {showText ? 'Ocultar texto' : 'Ver texto'}
          </button>
          <button
            onClick={onDownload}
            className="text-xs text-slate-500 hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-700"
          >
            Descargar
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
        onError={() => setLoadError(true)}
      />
      {loadError && (
        <p className="text-xs text-amber-500 bg-amber-950/30 border border-amber-800/40 rounded-xl px-3 py-2">
          Audio no disponible en esta sesion. Descargalo antes de cerrar el navegador para conservarlo.
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-colors shrink-0"
        >
          {playing ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 1}
            value={current}
            onChange={handleSeek}
            className="w-full accent-indigo-500 h-1.5 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {showText && text && (
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/60">
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{text}</p>
        </div>
      )}
    </div>
  );
}
