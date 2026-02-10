"use client";

import { useState } from "react";
import { PARTY_COLORS } from "@/data/electionData";
import type { TopCandidate } from "@/hooks/useSentiment";

function titleCase(str: string): string {
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

interface TopCandidatesProps {
  candidates: TopCandidate[];
  totalLikes: number;
  onDistrictSelect: (district: string) => void;
}

export default function TopCandidates({ candidates, totalLikes, onDistrictSelect }: TopCandidatesProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (candidates.length === 0) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden w-72">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-semibold text-white">Top Liked Candidates</span>
          {totalLikes > 0 && (
            <span className="text-xs text-slate-500">({totalLikes} votes)</span>
          )}
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-slate-400 transition-transform ${collapsed ? "" : "rotate-180"}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* List */}
      {!collapsed && (
        <div className="border-t border-slate-700/50 max-h-56 overflow-y-auto">
          {candidates.slice(0, 8).map((c, idx) => {
            const color = PARTY_COLORS[c.party] || "#6b7280";
            return (
              <button
                key={`${c.district}-${c.zone}-${c.candidate_name}`}
                onClick={() => onDistrictSelect(c.district)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800/50 transition-colors text-left"
              >
                <span className="text-xs text-slate-500 w-4 shrink-0 text-right">
                  {idx + 1}.
                </span>
                <div
                  className="w-1.5 h-6 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium truncate">
                    {c.candidate_name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {c.party_short} · {titleCase(c.district)} Zone {c.zone}
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-400 tabular-nums shrink-0">
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      {!collapsed && (
        <div className="border-t border-slate-700/50 px-3 py-2 bg-amber-500/5">
          <p className="text-[10px] text-amber-400/70 leading-relaxed">
            ⚠ Not actual results — reflects user sentiment only
          </p>
        </div>
      )}
    </div>
  );
}
