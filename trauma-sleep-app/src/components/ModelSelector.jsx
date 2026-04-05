import { TEXT_MODEL_OPTIONS, AUDIO_MODEL_OPTIONS, IMAGE_MODEL_OPTIONS, MODEL_TEXT, MODEL_AUDIO, MODEL_IMAGE } from "../lib/openai";

function ChevronDown() {
  return (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ModelSelect({ label, value, options, defaultId, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        {value !== defaultId && (
          <button
            onClick={() => onChange(defaultId)}
            className="text-xs text-slate-600 hover:text-indigo-400 transition-colors"
          >
            Restablecer
          </button>
        )}
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800 pl-3 pr-8 py-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>
    </div>
  );
}

export default function ModelSelector({ textModel, audioModel, imageModel, onChange }) {
  return (
    <div className="w-full max-w-xl mx-auto space-y-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Modelos
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <ModelSelect
          label="Guion (texto)"
          value={textModel}
          options={TEXT_MODEL_OPTIONS}
          defaultId={MODEL_TEXT}
          onChange={(v) => onChange({ textModel: v })}
        />
        <ModelSelect
          label="Voz (audio)"
          value={audioModel}
          options={AUDIO_MODEL_OPTIONS}
          defaultId={MODEL_AUDIO}
          onChange={(v) => onChange({ audioModel: v })}
        />
        <ModelSelect
          label="Imagen"
          value={imageModel ?? MODEL_IMAGE}
          options={IMAGE_MODEL_OPTIONS}
          defaultId={MODEL_IMAGE}
          onChange={(v) => onChange({ imageModel: v })}
        />
      </div>
    </div>
  );
}
