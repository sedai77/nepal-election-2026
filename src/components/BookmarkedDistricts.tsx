"use client";

import { getDistrictData, PROVINCE_COLORS } from "@/data/electionData";
import BookmarkButton from "./BookmarkButton";

interface BookmarkedDistrictsProps {
  bookmarks: string[];
  onSelect: (district: string) => void;
  onToggle: (district: string) => void;
}

function titleCase(str: string): string {
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function BookmarkedDistricts({ bookmarks, onSelect, onToggle }: BookmarkedDistrictsProps) {
  if (bookmarks.length === 0) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-700/30 flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
        <span className="text-xs font-semibold text-slate-300">Saved Districts</span>
        <span className="text-[10px] text-slate-500 ml-auto">{bookmarks.length}</span>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {bookmarks.map((district) => {
          const data = getDistrictData(district);
          const color = data ? PROVINCE_COLORS[data.province] : "#6b7280";
          return (
            <div
              key={district}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800/50 transition-colors cursor-pointer group"
              onClick={() => onSelect(district)}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-sm text-slate-200 flex-1 truncate group-hover:text-white transition-colors">
                {titleCase(district)}
              </span>
              <span className="text-xs text-slate-500">{data?.zones.length || 0}z</span>
              <BookmarkButton isBookmarked={true} onToggle={() => onToggle(district)} size="sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
