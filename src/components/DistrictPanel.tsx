"use client";

import { useState } from "react";
import { DistrictData, PROVINCE_NAMES, PROVINCE_COLORS, PARTY_COLORS, Candidate } from "@/data/electionData";
import { getDistrictResults, type ConstituencyResult } from "@/data/partyStrength";
import { useLikes } from "@/hooks/useLikes";
import { useAuth } from "@/contexts/AuthContext";
import BookmarkButton from "./BookmarkButton";
import ShareCard from "./ShareCard";
import LikeButton from "./LikeButton";

interface DistrictPanelProps {
  district: DistrictData;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

function titleCase(str: string): string {
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
  district: string;
  zone: number;
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
}

function CandidateCard({ candidate, rank, district, zone, likeCount, isLiked, onLike }: CandidateCardProps) {
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
      <LikeButton
        district={district}
        zone={zone}
        candidateName={candidate.name}
        party={candidate.party}
        partyShort={candidate.partyShort}
        likeCount={likeCount}
        isLiked={isLiked}
        onLike={onLike}
      />
    </div>
  );
}

function ResultCard({ result }: { result: ConstituencyResult }) {
  const partyColor = PARTY_COLORS[result.party] || "#6b7280";
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div
        className="w-2 h-10 rounded-full shrink-0"
        style={{ backgroundColor: partyColor }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-white font-medium text-sm truncate">{result.winner}</p>
          <span className="text-xs text-emerald-400 font-semibold shrink-0">WON</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
            style={{ backgroundColor: partyColor + "cc" }}
          >
            {result.party}
          </span>
          <span className="text-slate-500 text-xs">{result.constituency}</span>
        </div>
      </div>
    </div>
  );
}

type TabId = "candidates" | "results2022" | "share";

export default function DistrictPanel({ district, onClose, isBookmarked, onToggleBookmark }: DistrictPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("candidates");
  const provinceName = PROVINCE_NAMES[district.province];
  const provinceColor = PROVINCE_COLORS[district.province];
  const totalCandidates = district.zones.reduce((a, z) => a + z.candidates.length, 0);
  const results2022 = getDistrictResults(district.district);
  const { user } = useAuth();
  const { getLikeCount, isLikedByUser, toggleLike } = useLikes(district.district);

  // Count unique parties in 2022 results
  const partiesWon2022 = new Set(results2022.map((r) => r.party));

  return (
    <div className="md:h-full flex flex-col bg-slate-900/95 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{titleCase(district.district)}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: provinceColor }} />
              <span className="text-slate-300 text-sm">{provinceName}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <BookmarkButton isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{district.zones.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Zones</p>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{totalCandidates}</p>
            <p className="text-xs text-slate-400 mt-0.5">Candidates</p>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-white leading-tight mt-0.5">{titleCase(district.hq)}</p>
            <p className="text-xs text-slate-400 mt-0.5">HQ</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-slate-800/40 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("candidates")}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "candidates"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              2026
            </span>
          </button>
          <button
            onClick={() => setActiveTab("results2022")}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "results2022"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
              2022
            </span>
          </button>
          <button
            onClick={() => setActiveTab("share")}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "share"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
              Share
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="md:flex-1 md:overflow-y-auto p-4">
        {activeTab === "candidates" ? (
          <div className="space-y-4">
            {/* Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-300/90 leading-relaxed">
                <strong>Disclaimer:</strong> Likes reflect user sentiment only — not actual election results.
                {!user && (
                  <span className="text-amber-400/70"> Login with Facebook to vote for your favorite candidate.</span>
                )}
              </p>
            </div>

            {district.zones.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No candidate data available yet</p>
              </div>
            ) : (
              district.zones.map((zone) => (
                <div key={zone.zone} className="rounded-xl border border-slate-700/50 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Zone {zone.zone}</h3>
                      <span className="text-xs text-slate-400">{zone.candidates.length} candidates</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1.5">
                    {zone.candidates.map((candidate, idx) => (
                      <CandidateCard
                        key={idx}
                        candidate={candidate}
                        rank={idx + 1}
                        district={district.district}
                        zone={zone.zone}
                        likeCount={getLikeCount(zone.zone, candidate.name)}
                        isLiked={isLikedByUser(zone.zone, candidate.name)}
                        onLike={() =>
                          toggleLike(zone.zone, candidate.name, candidate.party, candidate.partyShort)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "results2022" ? (
          <div className="space-y-4">
            {results2022.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🗳️</div>
                <p className="text-slate-400 text-sm">No 2022 FPTP results available for this district</p>
              </div>
            ) : (
              <>
                {/* Summary banner */}
                <div className="rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">2022 FPTP Results</p>
                      <p className="text-sm font-semibold text-white mt-0.5">
                        {results2022.length} Constituencies
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Parties Won</p>
                      <p className="text-sm font-semibold text-white mt-0.5">{partiesWon2022.size}</p>
                    </div>
                  </div>
                  {/* Party color chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {Array.from(partiesWon2022).map((party) => {
                      const color = PARTY_COLORS[party] || "#6b7280";
                      const count = results2022.filter((r) => r.party === party).length;
                      return (
                        <span
                          key={party}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: color + "dd" }}
                        >
                          {party} ({count})
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Individual constituency results */}
                <div className="space-y-1.5">
                  {results2022.map((result, idx) => (
                    <ResultCard key={idx} result={result} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <ShareCard district={district} />
        )}
      </div>
    </div>
  );
}
