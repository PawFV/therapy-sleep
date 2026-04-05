import { HEADERS } from '../lib/prompts';

export default function HeaderSelector({ selected, onSelect }) {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-slate-400 mb-3">
        Que necesitas ahora
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {HEADERS.map((h) => (
          <button
            key={h.id}
            onClick={() => onSelect(h)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-200
              ${selected?.id === h.id
                ? 'bg-indigo-600/30 border-indigo-500 text-white'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-indigo-700 hover:text-slate-200'
              }
            `}
          >
            <span className="text-2xl">{h.icon}</span>
            <span className="text-xs font-semibold leading-tight">{h.label}</span>
            <span className="text-xs text-slate-500 leading-tight hidden sm:block">{h.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
