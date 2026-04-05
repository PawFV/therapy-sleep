import { useState } from 'react';
import AudioPlayer from './AudioPlayer';

export default function Library({ entries, playlist, onDelete, onClear, onAddToPlaylist, onRemoveFromPlaylist }) {
  const [expanded, setExpanded] = useState(null);

  if (entries.length === 0) {
    return (
      <div className="text-center py-10 text-slate-600 text-sm">
        Los audios que generes aparecen aca. Se guardan en tu navegador.
      </div>
    );
  }

  const playlistIds = new Set((playlist ?? []).map((e) => e.id));

  function downloadEntry(entry) {
    const a = document.createElement('a');
    a.href = entry.url;
    a.download = `${entry.id}.mp3`;
    a.click();
  }

  function togglePlaylist(entry) {
    if (playlistIds.has(entry.id)) {
      onRemoveFromPlaylist(entry.id);
    } else {
      onAddToPlaylist(entry);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm font-medium text-slate-400">
          {entries.length} audio{entries.length !== 1 ? 's' : ''} guardado{entries.length !== 1 ? 's' : ''}
        </p>
        <button onClick={onClear} className="text-xs text-slate-600 hover:text-red-400 transition-colors">
          Borrar todo
        </button>
      </div>

      {entries.map((entry) => {
        const inPlaylist = playlistIds.has(entry.id);
        return (
          <div
            key={entry.id}
            className="border border-slate-700/60 bg-slate-800/40 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4">
              <button
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="flex items-center gap-3 flex-1 text-left min-w-0"
              >
                <span className="text-xl">{entry.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{entry.label}</p>
                  <p className="text-xs text-slate-600">{entry.date}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-600 transition-transform shrink-0 ${expanded === entry.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                onClick={() => togglePlaylist(entry)}
                title={inPlaylist ? 'Quitar de playlist' : 'Agregar a playlist'}
                className={`shrink-0 p-2 rounded-xl transition-colors ${
                  inPlaylist
                    ? 'text-indigo-400 bg-indigo-900/40 hover:bg-indigo-900/60'
                    : 'text-slate-500 hover:text-indigo-400 hover:bg-slate-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {inPlaylist ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  )}
                </svg>
              </button>
            </div>

            {expanded === entry.id && (
              <div className="px-4 pb-4">
                <AudioPlayer
                  url={entry.url}
                  title={entry.label}
                  text={entry.text}
                  onDownload={() => downloadEntry(entry)}
                />
                <button
                  onClick={() => onDelete(entry.id)}
                  className="mt-3 text-xs text-slate-600 hover:text-red-400 transition-colors"
                >
                  Eliminar este audio
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
