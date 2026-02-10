"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { getDistrictData, electionData, PROVINCE_NAMES, PROVINCE_COLORS } from "@/data/electionData";
import { getRealPartyDominance } from "@/data/partyStrength";
import DistrictPanel from "@/components/DistrictPanel";
import SearchBar from "@/components/SearchBar";
import ProvinceFilter from "@/components/ProvinceFilter";
import CountdownTimer from "@/components/CountdownTimer";
import MapModeToggle, { type MapColorMode } from "@/components/MapModeToggle";
import BookmarkedDistricts from "@/components/BookmarkedDistricts";
import ShareSiteButton from "@/components/ShareSiteButton";
import FacebookLoginButton from "@/components/FacebookLoginButton";
import TopCandidates from "@/components/TopCandidates";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSentiment } from "@/hooks/useSentiment";

const NepalMap = dynamic(() => import("@/components/NepalMap"), { ssr: false });

function titleCase(str: string): string {
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>("JHAPA");
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [mapColorMode, setMapColorMode] = useState<MapColorMode>("province");
  const { bookmarks, toggle: toggleBookmark, isBookmarked } = useBookmarks();
  const { sentiment, topCandidates, totalLikes } = useSentiment();

  // Handle ?district= URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("district");
    if (d) setSelectedDistrict(d.toUpperCase());
  }, []);

  const districtData = selectedDistrict ? getDistrictData(selectedDistrict) : null;

  const handleDistrictSelect = useCallback((name: string | null) => {
    setSelectedDistrict(name);
  }, []);

  // Compute stats
  const totalZones = electionData.reduce((acc, d) => acc + d.zones.length, 0);
  const totalCandidates = electionData.reduce(
    (acc, d) => acc + d.zones.reduce((a, z) => a + z.candidates.length, 0), 0
  );

  // Party legend for heatmap mode — based on real 2022 FPTP results
  const partyDominance = getRealPartyDominance();

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-3 py-2 md:px-4 md:py-3 z-20">
          {/* Top row: Logo + Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 21h18M3 7v1a3 3 0 006 0V7m0 0V4a1 1 0 011-1h4a1 1 0 011 1v3m0 0v1a3 3 0 006 0V7m-6 0h6M9 7H3m6 4v6m6-6v6" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm md:text-lg font-bold text-white leading-tight">Nepal Election 2026</h1>
                <p className="text-[10px] md:text-xs text-slate-400 hidden sm:block">Election Zone Tracker</p>
              </div>
            </div>

            {/* Center: Countdown (desktop only) */}
            <div className="hidden lg:flex flex-1 justify-center">
              <CountdownTimer />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 md:gap-2 ml-auto lg:ml-0 lg:shrink-0">
              <div className="hidden sm:block">
                <SearchBar onSelect={(d) => setSelectedDistrict(d)} />
              </div>
              <Link
                href="/stats"
                className="shrink-0 p-2 md:px-3 md:py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-medium flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
                <span className="hidden sm:inline">Stats</span>
              </Link>
              <ShareSiteButton />
              <FacebookLoginButton />
            </div>
          </div>

          {/* Mobile: Search bar + Countdown row */}
          <div className="sm:hidden mt-2 flex items-center gap-2">
            <SearchBar onSelect={(d) => setSelectedDistrict(d)} />
          </div>
          <div className="lg:hidden mt-2 flex justify-center">
            <CountdownTimer />
          </div>
        </header>

        {/* Province Filter + Map Mode */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 px-4 py-2.5 z-10">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <ProvinceFilter selectedProvince={selectedProvince} onSelect={setSelectedProvince} />
            <MapModeToggle mode={mapColorMode} onChange={setMapColorMode} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex relative overflow-hidden">
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
              <div className="absolute bottom-3 right-3 md:top-4 md:right-4 md:bottom-auto bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 md:p-3 border border-slate-700/50 z-10">
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
              <div className="absolute bottom-3 right-3 md:top-4 md:right-4 md:bottom-auto bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 md:p-3 border border-slate-700/50 z-10 max-w-[180px] md:max-w-[220px]">
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
              <div className="absolute bottom-3 right-3 md:top-4 md:right-4 md:bottom-auto bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 md:p-3 border border-slate-700/50 z-10 max-w-[180px] md:max-w-[220px]">
                <p className="text-[10px] md:text-xs font-semibold text-slate-300 mb-1.5 md:mb-2">2026 Sentiment Map</p>
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
                      <span className="text-xs text-slate-500">No likes yet</span>
                    </div>
                    <p className="text-[10px] text-amber-400/70 mt-1.5 leading-relaxed">
                      ⚠ Based on user sentiment — not actual results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-slate-500" />
                      <span className="text-xs text-slate-400">No sentiment data yet</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Like candidates to see sentiment heatmap. Election scheduled for March 5, 2026.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Click Hint — hidden on mobile to save space */}
            {!selectedDistrict && (
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md rounded-xl px-4 py-2 border border-slate-700/30 z-10 hidden md:block">
                <p className="text-xs text-slate-300">
                  {mapColorMode === "party"
                    ? "🏛️ Based on 2022 FPTP election results — Click for zone-level results"
                    : mapColorMode === "election2026"
                    ? "🗳️ 2026 Sentiment — Like candidates to color the map. Click a district to vote"
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
                  onDistrictSelect={(d) => setSelectedDistrict(d)}
                />
              </div>
            )}

            {/* Bookmarked Districts Panel */}
            {bookmarks.length > 0 && !selectedDistrict && (
              <div className="absolute bottom-20 right-4 z-10 w-64 hidden md:block">
                <BookmarkedDistricts
                  bookmarks={bookmarks}
                  onSelect={(d) => setSelectedDistrict(d)}
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
              />
            </div>
          )}
        </div>

        {/* Desktop: Province District List */}
        {selectedProvince && !selectedDistrict && (
          <div className="hidden md:block absolute bottom-20 left-4 z-20 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/50 p-3 max-h-64 overflow-y-auto w-72 shadow-2xl">
            <p className="text-sm font-semibold text-white mb-2 sticky top-0 bg-slate-900/95 pb-1">
              {PROVINCE_NAMES[selectedProvince]} Districts
            </p>
            <div className="space-y-1">
              {electionData
                .filter((d) => d.province === selectedProvince)
                .map((d) => (
                  <button
                    key={d.district}
                    onClick={() => setSelectedDistrict(d.district)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-200">{titleCase(d.district)}</span>
                    <span className="text-xs text-slate-500">{d.zones.length} zones</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ========== MOBILE MODALS — rendered OUTSIDE the overflow-hidden root ========== */}

      {/* Mobile: District detail bottom sheet */}
      {districtData && (
        <div className="md:hidden fixed inset-0 z-[9999] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedDistrict(null)}
          />
          {/* Bottom sheet */}
          <div className="mobile-sheet-up relative mt-auto h-[85vh] flex flex-col bg-slate-900 rounded-t-2xl border-t border-slate-700/50 shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center py-2 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-600" />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <DistrictPanel
                district={districtData}
                onClose={() => setSelectedDistrict(null)}
                isBookmarked={isBookmarked(districtData.district)}
                onToggleBookmark={() => toggleBookmark(districtData.district)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Province district list bottom sheet */}
      {selectedProvince && !selectedDistrict && (
        <div className="md:hidden fixed inset-0 z-[9998] flex flex-col">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedProvince(null)}
          />
          <div className="mobile-sheet-up relative mt-auto max-h-[60vh] bg-slate-900 rounded-t-2xl border-t border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-center py-2 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-600" />
            </div>
            <div className="px-4 pb-1 shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">
                  {PROVINCE_NAMES[selectedProvince]} Districts
                </p>
                <button
                  onClick={() => setSelectedProvince(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <div className="space-y-1">
                {electionData
                  .filter((d) => d.province === selectedProvince)
                  .map((d) => (
                    <button
                      key={d.district}
                      onClick={() => setSelectedDistrict(d.district)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-200">{titleCase(d.district)}</span>
                      <span className="text-xs text-slate-500">{d.zones.length} zones</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
