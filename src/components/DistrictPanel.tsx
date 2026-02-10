"use client";

import { DistrictData, PROVINCE_NAMES, PROVINCE_COLORS, Candidate } from "@/data/electionData";

interface DistrictPanelProps {
  district: DistrictData;
  onClose: () => void;
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function CandidateCard({ candidate, rank }: { candidate: Candidate; rank: number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
        style={{ backgroundColor: candidate.color }}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{candidate.name}</p>
        <div className="flex items-center gap-2">
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: candidate.color + "cc" }}
          >
            {candidate.partyShort}
          </span>
          <span className="text-slate-400 text-xs truncate">{candidate.party}</span>
        </div>
      </div>
    </div>
  );
}

export default function DistrictPanel({ district, onClose }: DistrictPanelProps) {
  const provinceName = PROVINCE_NAMES[district.province];
  const provinceColor = PROVINCE_COLORS[district.province];

  return (
    <div className="h-full flex flex-col bg-slate-900/95 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{titleCase(district.district)}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: provinceColor }}
              />
              <span className="text-slate-300 text-sm">{provinceName}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{district.zones.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Election Zones</p>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{titleCase(district.hq)}</p>
            <p className="text-xs text-slate-400 mt-0.5">Headquarters</p>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">
              {district.totalVoters ? (district.totalVoters / 1000).toFixed(0) + "K" : "N/A"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Total Voters</p>
          </div>
        </div>
      </div>

      {/* Zones & Candidates */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {district.zones.map((zone) => (
          <div key={zone.zone} className="rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Zone {zone.zone}
                </h3>
                <span className="text-xs text-slate-400">
                  {zone.candidates.length} candidates
                </span>
              </div>
            </div>
            <div className="p-2 space-y-1.5">
              {zone.candidates.map((candidate, idx) => (
                <CandidateCard key={idx} candidate={candidate} rank={idx + 1} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
