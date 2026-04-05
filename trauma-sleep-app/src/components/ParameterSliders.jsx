import { useState, useRef } from "react";
import { AVAILABLE_VOICES, generateVoicePreview } from "../lib/openai";
import { DURATION_PRESETS } from "../lib/prompts";
import { t } from "../lib/i18n";

export default function ParameterSliders({ params, onChange, apiKey, lang = 'en' }) {
  const [previewing, setPreviewing] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(null);
  const previewAudioRef = useRef(null);

  const T = (key, ...args) => t(lang, key, ...args);

  const SLIDERS = [
    { key: "warmth",    label: T("sliderWarmth"),    min: 1, max: 10, default: 5, left: T("sliderWarmthLeft"),    right: T("sliderWarmthRight") },
    { key: "closeness", label: T("sliderCloseness"), min: 1, max: 10, default: 5, left: T("sliderClosenessLeft"), right: T("sliderClosenessRight") },
    { key: "pace",      label: T("sliderPace"),      min: 1, max: 10, default: 4, left: T("sliderPaceLeft"),      right: T("sliderPaceRight") },
  ];

  function set(key, value) {
    onChange({ ...params, [key]: value });
  }

  async function handlePreview(voice) {
    if (!apiKey) return;

    if (previewing === voice) {
      previewAudioRef.current?.pause();
      previewAudioRef.current = null;
      setPreviewing(null);
      return;
    }

    previewAudioRef.current?.pause();
    previewAudioRef.current = null;
    setPreviewing(null);
    setLoadingPreview(voice);

    try {
      const url = await generateVoicePreview({
        apiKey,
        voice,
        audioModel: params.audioModel,
      });

      const audio = new Audio(url);
      previewAudioRef.current = audio;

      await audio.play();

      setLoadingPreview(null);
      setPreviewing(voice);
      audio.onended = () => setPreviewing(null);
      audio.onerror = () => setPreviewing(null);
    } catch {
      setLoadingPreview(null);
      setPreviewing(null);
    }
  }

  const selectedDuration = params.duration ?? 2;

  return (
    <div className="w-full space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-5">

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {T("audioLength")}
        </p>
        <div className="flex gap-2 flex-wrap">
          {DURATION_PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => set("duration", p.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedDuration === p.value
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-600">
          {T("wordsHint", DURATION_PRESETS.find((p) => p.value === selectedDuration)?.words ?? 220)}
        </p>
      </div>

      <div className="border-t border-slate-800" />

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {T("voiceLabel")}{apiKey && <span className="normal-case font-normal text-slate-600 ml-2">{T("voicePreviewHint")}</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_VOICES.map((v) => {
            const isSelected = (params.voice ?? "nova") === v;
            const isPlaying = previewing === v;
            const isLoading = loadingPreview === v;
            const activeBg = isSelected ? "bg-indigo-600" : "bg-slate-800";
            const activeBorder = isSelected ? "border-indigo-500" : "border-slate-700";
            return (
              <div key={v} className={`flex rounded-lg overflow-hidden border ${activeBorder}`}>
                <button
                  onClick={() => set("voice", v)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                >
                  {v}
                </button>
                {apiKey && (
                  <button
                    onClick={() => handlePreview(v)}
                    disabled={isLoading}
                    title={isPlaying ? T("voiceStop") : isLoading ? T("voiceLoading") : T("voiceListen")}
                    className={`px-2 py-1.5 border-l transition-colors disabled:cursor-wait ${activeBorder} ${
                      isPlaying || isLoading
                        ? `${activeBg} text-white`
                        : isSelected
                        ? "bg-indigo-600 text-indigo-200 hover:bg-indigo-500"
                        : "bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {isLoading ? (
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : isPlaying ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-800" />

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          {T("toneLabel")}
        </p>
        <div className="space-y-5">
          {SLIDERS.map((s) => {
            const val = params[s.key] ?? s.default;
            const pct = ((val - s.min) / (s.max - s.min)) * 100;
            return (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">{s.label}</span>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{s.left}</span>
                    <span className="text-indigo-400 font-mono font-semibold w-4 text-center">{val}</span>
                    <span>{s.right}</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    value={val}
                    onChange={(e) => set(s.key, Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-800" />

      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
          {T("contextLabel")} <span className="normal-case font-normal text-slate-600">{T("contextOptional")}</span>
        </label>
        <textarea
          value={params.context ?? ""}
          onChange={(e) => set("context", e.target.value)}
          placeholder={T("contextPlaceholder")}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

    </div>
  );
}
