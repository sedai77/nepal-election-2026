"use client";

import { PARTY_COLORS } from "@/data/electionData";
import type { ConstituencyVoteData } from "@/hooks/useSentiment";

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

interface PopularMatchupsProps {
  onSelectDistrict: (district: string) => void;
  voteData?: ConstituencyVoteData[];
}

export default function PopularMatchups({ onSelectDistrict, voteData }: PopularMatchupsProps) {
  // Build vote lookup from live data
  const getVoteCount = (district: string, zone: number, candidateName: string): number => {
    if (!voteData) return 0;
    const constituency = voteData.find(
      (c) => c.district === district && c.zone === zone
    );
    if (!constituency) return 0;
    // Match by last name (ekantipur may use slightly different name formatting)
    const lastNameSearch = candidateName.split(" ").pop()?.toLowerCase() || "";
    const candidate = constituency.candidates.find(
      (c) => c.name.toLowerCase().includes(lastNameSearch) ||
             lastNameSearch.includes(c.name.split(" ").pop()?.toLowerCase() || "")
    );
    return candidate?.votes || 0;
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
        const count1 = getVoteCount(matchup.district, matchup.zone, matchup.candidates[0].name);
        const count2 = getVoteCount(matchup.district, matchup.zone, matchup.candidates[1].name);

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
                <span className="text-[9px] text-emerald-400 tabular-nums font-medium">
                  ({count1.toLocaleString()})
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
                <span className="text-[9px] text-emerald-400 tabular-nums font-medium">
                  ({count2.toLocaleString()})
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
