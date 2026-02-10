"use client";

import { PROVINCE_NAMES, PROVINCE_COLORS } from "@/data/electionData";

interface ProvinceFilterProps {
  selectedProvince: number | null;
  onSelect: (province: number | null) => void;
}

export default function ProvinceFilter({ selectedProvince, onSelect }: ProvinceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
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
  );
}
