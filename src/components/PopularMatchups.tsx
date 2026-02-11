"use client";

import { PARTY_COLORS } from "@/data/electionData";

interface Matchup {
  title: string;
  district: string;
  zone: number;
  candidates: {
    name: string;
    party: string;
    partyShort: string;
    color: string;
  }[];
}

// Hardcoded popular matchups from real candidate data
const POPULAR_MATCHUPS: Matchup[] = [
  {
    title: "PM vs Balen",
    district: "JHAPA",
    zone: 5,
    candidates: [
      { name: "Kp Sharma Oli", party: "CPN-UML", partyShort: "UML", color: PARTY_COLORS["CPN-UML"] || "#dc2626" },
      { name: "Balendra Shah", party: "Rastriya Swotantra Party", partyShort: "RSP", color: PARTY_COLORS["Rastriya Swotantra Party"] || "#0ea5e9" },
    ],
  },
  {
    title: "Rabi's Turf",
    district: "CHITWAN",
    zone: 2,
    candidates: [
      { name: "Rabi Lamichhane", party: "Rastriya Swotantra Party", partyShort: "RSP", color: PARTY_COLORS["Rastriya Swotantra Party"] || "#0ea5e9" },
      { name: "Asmin Ghimire", party: "CPN-UML", partyShort: "UML", color: PARTY_COLORS["CPN-UML"] || "#dc2626" },
    ],
  },
  {
    title: "Kathmandu-1",
    district: "KATHMANDU",
    zone: 1,
    candidates: [
      { name: "Ranju Darshana", party: "Rastriya Swotantra Party", partyShort: "RSP", color: PARTY_COLORS["Rastriya Swotantra Party"] || "#0ea5e9" },
      { name: "Mohan Regmi", party: "CPN-UML", partyShort: "UML", color: PARTY_COLORS["CPN-UML"] || "#dc2626" },
    ],
  },
];

interface PopularMatchupsProps {
  onSelectDistrict: (district: string) => void;
}

export default function PopularMatchups({ onSelectDistrict }: PopularMatchupsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
      <span className="text-[10px] md:text-xs text-slate-500 font-medium shrink-0 hidden sm:inline">
        Trending:
      </span>
      <span className="text-[10px] text-slate-500 font-medium shrink-0 sm:hidden">
        🔥
      </span>
      {POPULAR_MATCHUPS.map((matchup) => (
        <button
          key={`${matchup.district}-${matchup.zone}`}
          onClick={() => onSelectDistrict(matchup.district)}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700/80 hover:border-slate-600 transition-all group"
        >
          <span className="text-[10px] md:text-xs text-slate-400 group-hover:text-slate-200 font-medium">
            {matchup.title}:
          </span>
          <div className="flex items-center gap-1">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: matchup.candidates[0].color }}
            />
            <span className="text-[10px] md:text-xs text-white font-semibold truncate max-w-[80px]">
              {matchup.candidates[0].name.split(" ").pop()}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold">vs</span>
          <div className="flex items-center gap-1">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: matchup.candidates[1].color }}
            />
            <span className="text-[10px] md:text-xs text-white font-semibold truncate max-w-[80px]">
              {matchup.candidates[1].name.split(" ").pop()}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
