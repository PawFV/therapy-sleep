import { useState, useRef, useEffect } from 'react';

function formatTime(s) {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function PlaylistPlayer({ entries, onClose, onRemove }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const track = entries[currentIdx];

  useEffect(() => {
    setCurrent(0);
    setDuration(0);
    if (playing && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentIdx]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function handleEnded() {
    const next = currentIdx + 1;
    if (next < entries.length) {
      setCurrentIdx(next);
    } else if (loop) {
      setCurrentIdx(0);
      setTimeout(() => audioRef.current?.play(), 50);
    } else {
      setPlaying(false);
    }
  }

  function prev() {
    setCurrentIdx((i) => Math.max(0, i - 1));
  }

  function next() {
    setCurrentIdx((i) => Math.min(entries.length - 1, i + 1));
  }

  function handleSeek(e) {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrent(val);
  }

  async function downloadAll() {
    for (const entry of entries) {
      const a = document.createElement('a');
      a.href = entry.url;
      a.download = `${entry.id}.mp3`;
      a.click();
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  function downloadCurrent() {
    const a = document.createElement('a');
    a.href = track.url;
    a.download = `${track.id}.mp3`;
    a.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-800">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">Playlist</p>
            <p className="text-sm font-semibold text-slate-200">{entries.length} audios</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadAll}
              title="Descargar todos"
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{track.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{track.label}</p>
              <p className="text-xs text-slate-500">{currentIdx + 1} / {entries.length}</p>
            </div>
            <button
              onClick={downloadCurrent}
              title="Descargar este audio"
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
          </div>

          <audio
            ref={audioRef}
            src={track.url}
            onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={handleEnded}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          <div className="flex flex-col gap-1">
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

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              disabled={currentIdx === 0}
              className="p-2 rounded-full text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-colors shadow-lg shadow-indigo-900/40"
            >
              {playing ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={next}
              disabled={currentIdx === entries.length - 1}
              className="p-2 rounded-full text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm2.5-6l8.5 6V6z" transform="scale(-1,1) translate(-24,0)" />
                <path d="M18 6h-2v12h2zM6 6l8.5 6L6 18V6z" />
              </svg>
            </button>

            <button
              onClick={() => setLoop(!loop)}
              title={loop ? 'Loop activado' : 'Loop desactivado'}
              className={`p-2 rounded-full transition-colors ${loop ? 'text-indigo-400 bg-indigo-900/40' : 'text-slate-600 hover:text-slate-300'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 max-h-48 overflow-y-auto">
          {entries.map((e, i) => (
            <div
              key={e.id}
              className={`flex items-center gap-1 transition-colors ${
                i === currentIdx ? 'bg-indigo-900/30' : 'hover:bg-slate-800/60'
              }`}
            >
              <button
                onClick={() => { setCurrentIdx(i); setPlaying(true); setTimeout(() => audioRef.current?.play(), 50); }}
                className={`flex items-center gap-3 flex-1 px-5 py-3 text-left min-w-0 ${
                  i === currentIdx ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-base">{e.icon}</span>
                <span className="text-xs flex-1 truncate">{e.label}</span>
                {i === currentIdx && playing && (
                  <span className="flex gap-0.5 shrink-0">
                    {[0, 1, 2].map((b) => (
                      <span key={b} className="w-0.5 h-3 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: `${b * 150}ms` }} />
                    ))}
                  </span>
                )}
              </button>
              {onRemove && (
                <button
                  onClick={() => {
                    if (i < currentIdx) setCurrentIdx((c) => c - 1);
                    else if (i === currentIdx && i === entries.length - 1) setCurrentIdx(Math.max(0, i - 1));
                    onRemove(e.id);
                  }}
                  title="Quitar de playlist"
                  className="px-3 py-3 text-slate-600 hover:text-red-400 transition-colors shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
