"use client";

export type MapColorMode = "province" | "party" | "election2026";

interface MapModeToggleProps {
  mode: MapColorMode;
  onChange: (mode: MapColorMode) => void;
}

export default function MapModeToggle({ mode, onChange }: MapModeToggleProps) {
  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/50 p-1 flex gap-1">
      <button
        onClick={() => onChange("province")}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          mode === "province"
            ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Province
        </span>
      </button>
      <button
        onClick={() => onChange("party")}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          mode === "party"
            ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
          2022 Results
        </span>
      </button>
      <button
        onClick={() => onChange("election2026")}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          mode === "election2026"
            ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          2026 Election
        </span>
      </button>
    </div>
  );
}
