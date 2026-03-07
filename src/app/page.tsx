"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { getDistrictData, electionData, PROVINCE_NAMES, PROVINCE_COLORS } from "@/data/electionData";
import { getRealPartyDominance } from "@/data/partyStrength";
import DistrictPanel from "@/components/DistrictPanel";
import SearchBar from "@/components/SearchBar";
import MapModeToggle, { type MapColorMode } from "@/components/MapModeToggle";
import BookmarkedDistricts from "@/components/BookmarkedDistricts";
import TopCandidates from "@/components/TopCandidates";
import ListView from "@/components/ListView";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSentiment } from "@/hooks/useSentiment";

const NepalMap = dynamic(() => import("@/components/NepalMap"), { ssr: false });

function titleCase(str: string): string {
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

type ViewMode = "map" | "list";

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [mapColorMode, setMapColorMode] = useState<MapColorMode>("election2026");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { bookmarks, toggle: toggleBookmark, isBookmarked } = useBookmarks();
  const { sentiment, topCandidates, totalLikes, constituencies, lastUpdated, changedConstituencies, recentlyUpdated, isFetching, fetchCount, secondsUntilRefresh } = useSentiment();

  // Handle ?district= URL param on mount + auto-select Jhapa on desktop
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("district");
    if (d) {
      setSelectedDistrict(d.toUpperCase());
      setViewMode("map");
    }
    setInitialLoad(false);
  }, []);

  const districtData = selectedDistrict ? getDistrictData(selectedDistrict) : null;

  const handleDistrictSelect = useCallback((name: string | null) => {
    setSelectedDistrict(name);
    // Switch to map view when selecting a district
    if (name) setViewMode("map");
  }, []);

  // Compute stats
  const totalZones = electionData.reduce((acc, d) => acc + d.zones.length, 0);
  const totalCandidates = electionData.reduce(
    (acc, d) => acc + d.zones.reduce((a, z) => a + z.candidates.length, 0), 0
  );

  // Party legend for heatmap mode
  const partyDominance = getRealPartyDominance();

  // Count results stats
  const declaredCount = constituencies.filter((c) => c.status === "DECLARED").length;
  const countingCount = constituencies.filter((c) => c.status === "COUNTING").length;

  // ---- Party seat tallies (won + leading) ----
  const TOTAL_SEATS = 275; // 165 FPTP + 110 PR
  const FPTP_SEATS = 165;
  const PR_SEATS = 110;
  const TWO_THIRDS = 184; // ceil(275 * 2/3)

  // Won seats: DECLARED constituencies where a candidate isWinner
  const wonByParty: Record<string, { seats: number; color: string }> = {};
  // Leading seats: COUNTING constituencies, top candidate
  const leadingByParty: Record<string, { seats: number; color: string }> = {};

  for (const c of constituencies) {
    if (c.status === "DECLARED") {
      const winner = c.candidates.find((cand) => cand.isWinner);
      if (winner) {
        if (!wonByParty[winner.partyShort]) wonByParty[winner.partyShort] = { seats: 0, color: winner.color };
        wonByParty[winner.partyShort].seats++;
      }
    } else if (c.status === "COUNTING") {
      const sorted = [...c.candidates].sort((a, b) => b.votes - a.votes);
      if (sorted.length > 0 && sorted[0].votes > 0) {
        const leader = sorted[0];
        if (!leadingByParty[leader.partyShort]) leadingByParty[leader.partyShort] = { seats: 0, color: leader.color };
        leadingByParty[leader.partyShort].seats++;
      }
    }
  }

  // Combined party standings for the seats table
  const allParties = new Set([...Object.keys(wonByParty), ...Object.keys(leadingByParty)]);
  const partyStandings = Array.from(allParties).map((p) => ({
    party: p,
    won: wonByParty[p]?.seats || 0,
    leading: leadingByParty[p]?.seats || 0,
    total: (wonByParty[p]?.seats || 0) + (leadingByParty[p]?.seats || 0),
    color: wonByParty[p]?.color || leadingByParty[p]?.color || "#6b7280",
  })).sort((a, b) => b.total - a.total);

  // 2/3 majority calculation for top party
  const topParty = partyStandings[0];
  const topFptpTotal = topParty ? topParty.total : 0;
  const topFptpWon = topParty ? topParty.won : 0;
  // Estimate PR seats proportionally based on FPTP performance
  const fptpDeclaredAndCounting = declaredCount + countingCount;
  const topFptpPercent = fptpDeclaredAndCounting > 0 ? topFptpTotal / fptpDeclaredAndCounting : 0;
  const estimatedPrSeats = Math.round(topFptpPercent * PR_SEATS);
  const projectedTotal = topFptpTotal + estimatedPrSeats;
  const canReachTwoThirds = projectedTotal >= TWO_THIRDS;
  const seatsNeeded = Math.max(0, TWO_THIRDS - projectedTotal);

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-3 py-2 md:px-4 md:py-3 z-20">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 21h18M3 7v1a3 3 0 006 0V7m0 0V4a1 1 0 011-1h4a1 1 0 011 1v3m0 0v1a3 3 0 006 0V7m-6 0h6M9 7H3m6 4v6m6-6v6" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm md:text-lg font-bold text-white leading-tight">Nepal Election 2026</h1>
              </div>
            </div>

            {/* Center: LIVE indicator */}
            <div className="flex-1 flex justify-center">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500 ${
                isFetching
                  ? "bg-red-500/20 border-red-500/40 shadow-lg shadow-red-500/10 fetch-pulse"
                  : "bg-red-500/10 border-red-500/20"
              }`}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isFetching ? "bg-red-400" : "bg-red-500"}`}></span>
                </span>
                <span className="text-sm md:text-base font-black text-red-500 tracking-wider live-blink">
                  LIVE
                </span>
                <span className="text-[10px] md:text-xs text-red-400/50 font-mono tabular-nums hidden sm:inline">
                  {isFetching ? "syncing..." : `${secondsUntilRefresh}s`}
                </span>
                {declaredCount > 0 && (
                  <span className="text-[10px] md:text-xs text-red-400/70 font-medium">
                    {declaredCount} declared
                  </span>
                )}
              </div>
            </div>

            {/* Right: Search */}
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <div className="hidden sm:block">
                <SearchBar onSelect={(d) => handleDistrictSelect(d)} />
              </div>
            </div>
          </div>

          {/* Mobile: Search bar */}
          <div className="sm:hidden mt-2">
            <SearchBar onSelect={(d) => handleDistrictSelect(d)} />
          </div>
        </header>

        {/* View Tabs + Map Mode */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 px-3 md:px-4 py-2 z-10">
          <div className="flex items-center justify-between gap-3">
            {/* View Mode Tabs */}
            <div className="bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/50 p-1 flex gap-1 shrink-0">
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === "map"
                    ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
                Map View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === "list"
                    ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                List View
              </button>
            </div>

            {/* Map Mode Toggle — only show in map view */}
            {viewMode === "map" && (
              <MapModeToggle mode={mapColorMode} onChange={setMapColorMode} />
            )}

            {/* Results summary — show in list view */}
            {viewMode === "list" && (
              <div className="hidden md:flex items-center gap-3 text-xs">
                {countingCount > 0 && (
                  <span className="text-amber-400">
                    {countingCount} counting
                  </span>
                )}
                {declaredCount > 0 && (
                  <span className="text-emerald-400">
                    {declaredCount} declared
                  </span>
                )}
                <span className="text-slate-500">
                  {constituencies.length} constituencies
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ===== 2/3 Majority Tracker + Party Seats ===== */}
        {partyStandings.length > 0 && (
          <div className="bg-slate-900/60 border-b border-slate-800/50 px-3 md:px-4 py-2.5 z-10 overflow-x-auto">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">

              {/* 2/3 Majority Calculator */}
              <div className="shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">2/3 Majority Tracker</h3>
                  <span className="text-[10px] text-slate-500">{TWO_THIRDS} seats needed of {TOTAL_SEATS}</span>
                </div>
                {topParty && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: topParty.color }} />
                      <span className="text-sm font-bold text-white">{topParty.party}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full lg:w-[320px]">
                      <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                        {/* Won portion */}
                        <div
                          className="absolute left-0 top-0 h-full transition-all duration-700"
                          style={{
                            width: `${(topFptpWon / TOTAL_SEATS) * 100}%`,
                            backgroundColor: topParty.color,
                          }}
                        />
                        {/* Leading portion (lighter) */}
                        <div
                          className="absolute top-0 h-full transition-all duration-700 opacity-50"
                          style={{
                            left: `${(topFptpWon / TOTAL_SEATS) * 100}%`,
                            width: `${((topParty.leading) / TOTAL_SEATS) * 100}%`,
                            backgroundColor: topParty.color,
                          }}
                        />
                        {/* Estimated PR (even lighter) */}
                        {estimatedPrSeats > 0 && (
                          <div
                            className="absolute top-0 h-full transition-all duration-700 opacity-25"
                            style={{
                              left: `${(topFptpTotal / TOTAL_SEATS) * 100}%`,
                              width: `${(estimatedPrSeats / TOTAL_SEATS) * 100}%`,
                              backgroundColor: topParty.color,
                            }}
                          />
                        )}
                        {/* 2/3 marker line */}
                        <div
                          className="absolute top-0 h-full w-[2px] bg-yellow-400 z-10"
                          style={{ left: `${(TWO_THIRDS / TOTAL_SEATS) * 100}%` }}
                        />
                        <div
                          className="absolute top-0 text-[9px] font-bold text-yellow-400 z-10"
                          style={{ left: `${(TWO_THIRDS / TOTAL_SEATS) * 100}%`, transform: "translateX(-50%)" }}
                        >
                          ⅔
                        </div>
                      </div>
                    </div>

                    {/* Numbers */}
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: topParty.color }} />
                        <span className="text-slate-300">Won: <span className="font-bold text-white">{topFptpWon}</span></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm opacity-50" style={{ backgroundColor: topParty.color }} />
                        <span className="text-slate-300">Leading: <span className="font-bold text-white">{topParty.leading}</span></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm opacity-25" style={{ backgroundColor: topParty.color }} />
                        <span className="text-slate-400">समानुपातिक (Est.): <span className="font-medium text-slate-300">~{estimatedPrSeats}</span></span>
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="font-bold" style={{ color: canReachTwoThirds ? "#22c55e" : "#f59e0b" }}>
                        Projected: {projectedTotal}/{TWO_THIRDS}
                      </span>
                      {canReachTwoThirds ? (
                        <span className="text-emerald-400 font-bold text-xs px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                          2/3 Possible
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                          Needs {seatsNeeded} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-slate-700/50 self-stretch" />
              <div className="lg:hidden h-px bg-slate-700/50" />

              {/* Party Seats Won */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Seats by Party</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {partyStandings.map((p) => (
                    <div key={p.party} className="flex items-center gap-2 min-w-[140px]">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-slate-300 font-medium w-12 truncate">{p.party}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white tabular-nums">{p.won}</span>
                        {p.leading > 0 && (
                          <span className="text-[10px] text-slate-400 tabular-nums">+{p.leading}</span>
                        )}
                      </div>
                      {/* Mini bar */}
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full rounded-full flex">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${(p.won / FPTP_SEATS) * 100}%`,
                              backgroundColor: p.color,
                            }}
                          />
                          <div
                            className="h-full transition-all duration-500 opacity-40"
                            style={{
                              width: `${(p.leading / FPTP_SEATS) * 100}%`,
                              backgroundColor: p.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex relative overflow-hidden">
          {viewMode === "map" ? (
            <>
              {/* Map */}
              <div className="flex-1 relative">
                <NepalMap
                  onDistrictSelect={handleDistrictSelect}
                  selectedDistrict={selectedDistrict}
                  colorMode={mapColorMode}
                  sentimentData={sentiment}
                />

                {/* Stats Overlay */}
                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex gap-1.5 md:gap-2 z-10">
                  <div className="bg-slate-900/90 backdrop-blur-md rounded-lg md:rounded-xl px-2.5 py-1.5 md:px-4 md:py-2.5 border border-slate-700/50">
                    <p className="text-lg md:text-2xl font-bold text-white">{electionData.length}</p>
                    <p className="text-[10px] md:text-xs text-slate-400">Districts</p>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-md rounded-lg md:rounded-xl px-2.5 py-1.5 md:px-4 md:py-2.5 border border-slate-700/50">
                    <p className="text-lg md:text-2xl font-bold text-white">{totalZones}</p>
                    <p className="text-[10px] md:text-xs text-slate-400">Zones</p>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-md rounded-lg md:rounded-xl px-2.5 py-1.5 md:px-4 md:py-2.5 border border-slate-700/50 hidden sm:block">
                    <p className="text-lg md:text-2xl font-bold text-white">{totalCandidates}</p>
                    <p className="text-[10px] md:text-xs text-slate-400">Candidates</p>
                  </div>
                </div>

                {/* Legend - Province mode */}
                {!selectedDistrict && mapColorMode === "province" && (
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 md:p-3 border border-slate-700/50 z-10">
                    <p className="text-[10px] md:text-xs font-semibold text-slate-300 mb-1.5 md:mb-2">Provinces</p>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-x-3 gap-y-1 md:space-y-1.5">
                      {Object.entries(PROVINCE_NAMES).map(([key, name]) => (
                        <div key={key} className="flex items-center gap-1.5 md:gap-2">
                          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm shrink-0" style={{ backgroundColor: PROVINCE_COLORS[Number(key)] }} />
                          <span className="text-[10px] md:text-xs text-slate-300 truncate">{name.replace(" Pradesh", "")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legend - Party mode */}
                {!selectedDistrict && mapColorMode === "party" && (
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 md:p-3 border border-slate-700/50 z-10 max-w-[180px] md:max-w-[220px]">
                    <p className="text-[10px] md:text-xs font-semibold text-slate-300 mb-1.5 md:mb-2">2022 FPTP Winner</p>
                    <div className="space-y-1 md:space-y-1.5">
                      {partyDominance.slice(0, 6).map((p) => (
                        <div key={p.party} className="flex items-center gap-1.5 md:gap-2">
                          <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                          <span className="text-[10px] md:text-xs text-slate-300 truncate flex-1">{p.party}</span>
                          <span className="text-[10px] md:text-xs text-slate-500 shrink-0">{p.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legend - 2026 Election mode */}
                {!selectedDistrict && mapColorMode === "election2026" && (
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 md:p-3 border border-slate-700/50 z-10 max-w-[180px] md:max-w-[220px]">
                    <p className="text-[10px] md:text-xs font-semibold text-slate-300 mb-1.5 md:mb-2">2026 Live Results</p>
                    {Object.keys(sentiment).length > 0 ? (
                      <div className="space-y-1.5">
                        {(() => {
                          const partyCounts: Record<string, { count: number; color: string; short: string }> = {};
                          Object.values(sentiment).forEach((s) => {
                            if (!partyCounts[s.partyShort]) {
                              partyCounts[s.partyShort] = { count: 0, color: s.color, short: s.partyShort };
                            }
                            partyCounts[s.partyShort].count++;
                          });
                          const sorted = Object.values(partyCounts).sort((a, b) => b.count - a.count);
                          return sorted.map((p) => (
                            <div key={p.short} className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                              <span className="text-xs text-slate-300 truncate flex-1">{p.short}</span>
                              <span className="text-xs text-slate-500 shrink-0">{p.count} districts</span>
                            </div>
                          ));
                        })()}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-3 h-3 rounded-sm bg-slate-500 shrink-0" />
                          <span className="text-xs text-slate-500">No data yet</span>
                        </div>
                        <p className="text-[10px] text-emerald-400/70 mt-1.5 leading-relaxed">
                          Source: Election Commission Nepal
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm bg-slate-500" />
                          <span className="text-xs text-slate-400">Awaiting vote data</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Live vote counts will appear as counting begins.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Click Hint — hidden on mobile */}
                {!selectedDistrict && (
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md rounded-xl px-4 py-2 border border-slate-700/30 z-10 hidden md:block">
                    <p className="text-xs text-slate-300">
                      {mapColorMode === "party"
                        ? "Based on 2022 FPTP election results — Click for zone-level results"
                        : mapColorMode === "election2026"
                        ? "2026 Live Results — Click a district to view vote counts"
                        : "Click on a district to view election zones & candidates"}
                    </p>
                  </div>
                )}

                {/* Top Candidates Overlay */}
                {!selectedDistrict && topCandidates.length > 0 && (
                  <div className="absolute top-14 left-4 z-10 hidden md:block">
                    <TopCandidates
                      candidates={topCandidates}
                      totalLikes={totalLikes}
                      onDistrictSelect={(d) => handleDistrictSelect(d)}
                    />
                  </div>
                )}

                {/* Bookmarked Districts Panel */}
                {bookmarks.length > 0 && !selectedDistrict && (
                  <div className="absolute bottom-20 right-4 z-10 w-64 hidden md:block">
                    <BookmarkedDistricts
                      bookmarks={bookmarks}
                      onSelect={(d) => handleDistrictSelect(d)}
                      onToggle={toggleBookmark}
                    />
                  </div>
                )}
              </div>

              {/* Detail Panel — Desktop: side panel */}
              {districtData && (
                <div className="panel-slide-in hidden md:block w-[420px] h-full relative z-auto border-l border-slate-700/50">
                  <DistrictPanel
                    district={districtData}
                    onClose={() => setSelectedDistrict(null)}
                    isBookmarked={isBookmarked(districtData.district)}
                    onToggleBookmark={() => toggleBookmark(districtData.district)}
                    voteData={constituencies}
                  />
                </div>
              )}
            </>
          ) : (
            /* List View */
            <ListView
              constituencies={constituencies}
              changedConstituencies={changedConstituencies}
              recentlyUpdated={recentlyUpdated}
              onSelectDistrict={handleDistrictSelect}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="shrink-0 bg-slate-900 border-t border-slate-800 px-4 py-1.5 z-20 relative overflow-hidden">
          {/* Sweep animation on fetch */}
          {isFetching && (
            <div className="absolute inset-0 fetch-sweep pointer-events-none" />
          )}
          <div className="relative flex items-center justify-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] text-slate-500 flex-wrap">
            <span className="hidden sm:inline">Source: Election Commission Nepal</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            {isFetching ? (
              <span className="text-blue-400 font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Syncing...
              </span>
            ) : (
              <span className="tabular-nums">
                Next update in <span className={`font-mono ${secondsUntilRefresh <= 5 ? "text-amber-400" : ""}`}>{secondsUntilRefresh}s</span>
              </span>
            )}
            {lastUpdated > 0 && (
              <>
                <span className="text-slate-700">|</span>
                <span>Last: {new Date(lastUpdated).toLocaleTimeString()}</span>
              </>
            )}
            {fetchCount > 0 && (
              <>
                <span className="text-slate-700 hidden sm:inline">|</span>
                <span className="text-slate-600 hidden sm:inline">{fetchCount} updates</span>
              </>
            )}
          </div>
          {/* Progress bar for countdown */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500/50 to-blue-400/30 transition-all duration-1000 ease-linear"
              style={{ width: `${((15 - secondsUntilRefresh) / 15) * 100}%` }}
            />
          </div>
        </footer>
      </div>

      {/* ========== MOBILE MODALS ========== */}

      {/* Mobile: District detail bottom sheet */}
      {districtData && viewMode === "map" && (
        <div className="md:hidden fixed inset-0 z-[9999] flex flex-col">
          <div
            className="flex-1 min-h-[15vh]"
            onClick={() => setSelectedDistrict(null)}
          />
          <div className="mobile-sheet-up relative h-[70vh] flex flex-col bg-slate-900 rounded-t-2xl border-t border-slate-700/50 shadow-2xl">
            <div className="flex flex-col items-center pt-2 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-600" />
              <p className="text-[10px] text-slate-500 mt-1">Tap above to close</p>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <DistrictPanel
                district={districtData}
                onClose={() => setSelectedDistrict(null)}
                isBookmarked={isBookmarked(districtData.district)}
                onToggleBookmark={() => toggleBookmark(districtData.district)}
                voteData={constituencies}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
