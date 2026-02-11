"use client";

import { useState, useEffect } from "react";
import { PARTY_COLORS } from "@/data/electionData";

interface MatchupCandidate {
  name: string;
  party: string;
  partyShort: string;
  color: string;
}

interface Matchup {
  title: string;
  district: string;
  zone: number;
  candidates: MatchupCandidate[];
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

// Like counts keyed by "DISTRICT_ZONE_CANDIDATENAME"
type LikeCounts = Record<string, number>;

interface PopularMatchupsProps {
  onSelectDistrict: (district: string) => void;
}

export default function PopularMatchups({ onSelectDistrict }: PopularMatchupsProps) {
  const [likeCounts, setLikeCounts] = useState<LikeCounts>({});

  useEffect(() => {
    // Fetch like counts for each matchup district
    const districts = [...new Set(POPULAR_MATCHUPS.map((m) => m.district))];

    districts.forEach(async (district) => {
      try {
        const res = await fetch(`/api/likes/${encodeURIComponent(district)}`);
        if (res.ok) {
          const data = await res.json();
          const counts = data.counts || {};
          // Flatten into our lookup map
          const newCounts: LikeCounts = {};
          for (const [zone, candidates] of Object.entries(counts)) {
            for (const [name, info] of Object.entries(candidates as Record<string, { count: number }>)) {
              newCounts[`${district}_${zone}_${name}`] = info.count;
            }
          }
          setLikeCounts((prev) => ({ ...prev, ...newCounts }));
        }
      } catch {
        // Non-critical
      }
    });
  }, []);

  const getCount = (district: string, zone: number, name: string) => {
    return likeCounts[`${district}_${zone}_${name}`] || 0;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
      <span className="text-[10px] md:text-xs text-slate-500 font-medium shrink-0 hidden sm:inline">
        🔥 Trending:
      </span>
      <span className="text-[10px] text-slate-500 font-medium shrink-0 sm:hidden">
        🔥
      </span>
      {POPULAR_MATCHUPS.map((matchup) => {
        const count1 = getCount(matchup.district, matchup.zone, matchup.candidates[0].name);
        const count2 = getCount(matchup.district, matchup.zone, matchup.candidates[1].name);

        return (
          <button
            key={`${matchup.district}-${matchup.zone}`}
            onClick={() => onSelectDistrict(matchup.district)}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700/80 hover:border-slate-600 transition-all group"
          >
            <span className="text-[10px] md:text-xs text-slate-400 group-hover:text-slate-200 font-medium">
              {matchup.title}:
            </span>
            {/* Candidate 1 */}
            <div className="flex items-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: matchup.candidates[0].color }}
              />
              <span className="text-[10px] md:text-xs text-white font-semibold truncate max-w-[80px]">
                {matchup.candidates[0].name.split(" ").pop()}
              </span>
              {count1 > 0 && (
                <span className="text-[9px] text-slate-500 tabular-nums">
                  ({count1})
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-bold">vs</span>
            {/* Candidate 2 */}
            <div className="flex items-center gap-1">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: matchup.candidates[1].color }}
              />
              <span className="text-[10px] md:text-xs text-white font-semibold truncate max-w-[80px]">
                {matchup.candidates[1].name.split(" ").pop()}
              </span>
              {count2 > 0 && (
                <span className="text-[9px] text-slate-500 tabular-nums">
                  ({count2})
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
