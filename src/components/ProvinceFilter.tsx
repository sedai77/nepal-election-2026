"use client";

import { useState } from "react";
import { PROVINCE_NAMES, PROVINCE_COLORS } from "@/data/electionData";

interface ProvinceFilterProps {
  selectedProvince: number | null;
  onSelect: (province: number | null) => void;
}

export default function ProvinceFilter({ selectedProvince, onSelect }: ProvinceFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedName = selectedProvince ? PROVINCE_NAMES[selectedProvince]?.replace(" Pradesh", "") : null;
  const selectedColor = selectedProvince ? PROVINCE_COLORS[selectedProvince] : undefined;

  return (
    <>
      {/* Mobile: Compact dropdown-style */}
      <div className="md:hidden relative">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedProvince
              ? "text-white shadow-md ring-1 ring-white/20"
              : "bg-slate-800 text-slate-300"
          }`}
          style={selectedProvince ? { backgroundColor: selectedColor } : undefined}
        >
          {selectedProvince && (
            <span className="w-2 h-2 rounded-full bg-white/60" />
          )}
          {selectedName || "All Provinces"}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMobileOpen(false)}
            />
            {/* Dropdown menu */}
            <div className="absolute top-full left-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 w-52 overflow-hidden">
              <button
                onClick={() => { onSelect(null); setMobileOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                  selectedProvince === null
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                All Provinces
              </button>
              {Object.entries(PROVINCE_NAMES).map(([key, name]) => {
                const province = Number(key);
                const color = PROVINCE_COLORS[province];
                const isActive = selectedProvince === province;
                return (
                  <button
                    key={province}
                    onClick={() => { onSelect(isActive ? null : province); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    {name}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Desktop: Horizontal pills */}
      <div className="hidden md:flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedProvince === null
              ? "bg-white text-slate-900 shadow-md"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All Provinces
        </button>
        {Object.entries(PROVINCE_NAMES).map(([key, name]) => {
          const province = Number(key);
          const color = PROVINCE_COLORS[province];
          const isActive = selectedProvince === province;
          return (
            <button
              key={province}
              onClick={() => onSelect(isActive ? null : province)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? "text-white shadow-md ring-1 ring-white/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
              style={isActive ? { backgroundColor: color } : undefined}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              {name.replace(" Pradesh", "")}
            </button>
          );
        })}
      </div>
    </>
  );
}
