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
  const { sentiment, topCandidates, totalLikes, constituencies, lastUpdated, changedConstituencies, recentlyUpdated } = useSentiment();

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
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-sm md:text-base font-black text-red-500 tracking-wider live-blink">
                  LIVE
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
        <footer className="shrink-0 bg-slate-900 border-t border-slate-800 px-4 py-1.5 z-20">
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
            <span>Source: Election Commission Nepal</span>
            <span className="text-slate-700">|</span>
            <span>Updates every 60s</span>
            {lastUpdated > 0 && (
              <>
                <span className="text-slate-700">|</span>
                <span>Last: {new Date(lastUpdated).toLocaleTimeString()}</span>
              </>
            )}
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
