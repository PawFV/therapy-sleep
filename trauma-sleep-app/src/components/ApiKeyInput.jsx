import { useState } from "react";
import { validateApiKey } from "../lib/openai";
import { saveApiKey, clearApiKey } from "../lib/storage";
import { t } from "../lib/i18n";

export default function ApiKeyInput({ apiKey, onKeySet, lang = 'en' }) {
  const [input, setInput] = useState(apiKey || "");
  const [status, setStatus] = useState(apiKey ? "saved" : "idle");
  const [error, setError] = useState("");

  const T = (key) => t(lang, key);

  async function handleSave() {
    if (!input.trim()) return;
    setStatus("validating");
    setError("");
    const result = await validateApiKey(input.trim());
    if (result.valid) {
      saveApiKey(input.trim());
      setStatus("saved");
      onKeySet(input.trim());
    } else {
      setStatus("error");
      setError(T("apiKeyError"));
    }
  }

  function handleClear() {
    clearApiKey();
    setInput("");
    setStatus("idle");
    setError("");
    onKeySet("");
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <label className="block text-sm font-medium text-slate-400 mb-2">
        <a
          href="https://platform.openai.com/account/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300"
        >
          {T("apiKeyLabel")}
        </a>
      </label>
      <div className="flex gap-2">
        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="sk-proj-..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm"
        />
        {status === "saved" ? (
          <button
            onClick={handleClear}
            className="px-4 py-3 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm font-medium"
          >
            {T("apiKeyChange")}
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={status === "validating" || !input.trim()}
            className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[90px]"
          >
            {status === "validating" ? T("apiKeyVerifying") : T("apiKeySave")}
          </button>
        )}
      </div>

      {status === "saved" && (
        <p className="mt-2 text-xs text-emerald-400">{T("apiKeyActive")}</p>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {status === "idle" && !error && (
        <p className="mt-2 text-xs text-slate-600">{T("apiKeyHint")}</p>
      )}
    </div>
  );
}
