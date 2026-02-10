"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { getDistrictData, electionData, PROVINCE_NAMES, PROVINCE_COLORS } from "@/data/electionData";
import DistrictPanel from "@/components/DistrictPanel";
import SearchBar from "@/components/SearchBar";
import ProvinceFilter from "@/components/ProvinceFilter";

const NepalMap = dynamic(() => import("@/components/NepalMap"), { ssr: false });

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

  const districtData = selectedDistrict ? getDistrictData(selectedDistrict) : null;

  const handleDistrictSelect = useCallback((name: string | null) => {
    setSelectedDistrict(name);
  }, []);

  // Compute stats
  const totalZones = electionData.reduce((acc, d) => acc + d.zones.length, 0);
  const totalCandidates = electionData.reduce(
    (acc, d) => acc + d.zones.reduce((a, z) => a + z.candidates.length, 0), 0
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 z-20">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 21h18M3 7v1a3 3 0 006 0V7m0 0V4a1 1 0 011-1h4a1 1 0 011 1v3m0 0v1a3 3 0 006 0V7m-6 0h6M9 7H3m6 4v6m6-6v6" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Nepal Election 2026</h1>
              <p className="text-xs text-slate-400">Election Zone Tracker</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 md:justify-end">
            <SearchBar onSelect={(d) => setSelectedDistrict(d)} />
          </div>
        </div>
      </header>

      {/* Province Filter */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 px-4 py-2.5 z-10">
        <ProvinceFilter selectedProvince={selectedProvince} onSelect={setSelectedProvince} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <NepalMap onDistrictSelect={handleDistrictSelect} selectedDistrict={selectedDistrict} />

          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-xl px-4 py-2.5 border border-slate-700/50">
              <p className="text-2xl font-bold text-white">{electionData.length}</p>
              <p className="text-xs text-slate-400">Districts</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-md rounded-xl px-4 py-2.5 border border-slate-700/50">
              <p className="text-2xl font-bold text-white">{totalZones}</p>
              <p className="text-xs text-slate-400">Election Zones</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur-md rounded-xl px-4 py-2.5 border border-slate-700/50 hidden sm:block">
              <p className="text-2xl font-bold text-white">{totalCandidates}</p>
              <p className="text-xs text-slate-400">Candidates</p>
            </div>
          </div>

          {/* Province Legend */}
          {!selectedDistrict && (
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700/50 z-10 hidden md:block">
              <p className="text-xs font-semibold text-slate-300 mb-2">Provinces</p>
              <div className="space-y-1.5">
                {Object.entries(PROVINCE_NAMES).map(([key, name]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: PROVINCE_COLORS[Number(key)] }}
                    />
                    <span className="text-xs text-slate-300">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Click Hint */}
          {!selectedDistrict && (
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md rounded-xl px-4 py-2 border border-slate-700/30 z-10">
              <p className="text-xs text-slate-300">Click on a district to view election zones & candidates</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {districtData && (
          <div className="panel-slide-in w-full md:w-[420px] absolute md:relative inset-0 md:inset-auto z-30 md:z-auto border-l border-slate-700/50">
            <DistrictPanel district={districtData} onClose={() => setSelectedDistrict(null)} />
          </div>
        )}
      </div>

      {/* District List for filtered province */}
      {selectedProvince && !selectedDistrict && (
        <div className="absolute bottom-20 left-4 z-20 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/50 p-3 max-h-64 overflow-y-auto w-72 shadow-2xl">
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
  );
}
