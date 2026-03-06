"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { electionData, PARTY_COLORS, PROVINCE_NAMES, PROVINCE_COLORS } from "@/data/electionData";
import type { ConstituencyVoteData } from "@/hooks/useSentiment";

interface ListViewProps {
  constituencies: ConstituencyVoteData[];
  changedConstituencies: Set<string>;
  recentlyUpdated: Record<string, number>;
  onSelectDistrict: (district: string) => void;
}

// How long a card stays in the "recently updated" section (5 minutes)
const RECENT_WINDOW_MS = 5 * 60 * 1000;

// ---- Animated Number ----

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [delta, setDelta] = useState(0);
  const prevRef = useRef(value);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;
    if (from === to) { setDisplay(to); return; }

    const diff = to - from;
    setDelta(diff);
    setIsAnimating(true);

    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setDelta(0);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return (
    <span className={`inline-flex items-center gap-1 ${className || ""}`}>
      <span
        className={`transition-all duration-300 ${
          isAnimating
            ? "text-emerald-400 scale-110 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]"
            : ""
        }`}
        style={{ display: "inline-block", transformOrigin: "right center" }}
      >
        {display.toLocaleString()}
      </span>
      {isAnimating && delta !== 0 && (
        <span className="text-[9px] font-bold text-emerald-400 animate-bounce-in whitespace-nowrap">
          {delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString()}
        </span>
      )}
    </span>
  );
}

// ---- Helpers ----

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function statusColor(status: string): string {
  switch (status) {
    case "DECLARED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "COUNTING": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    default: return "bg-slate-700/30 text-slate-400 border-slate-600/30";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "DECLARED": return "Declared";
    case "COUNTING": return "Counting";
    default: return "Pending";
  }
}

function titleCase(str: string): string {
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

// ---- Featured Races ----

const FEATURED_RACES = [
  { constituency: "Jhapa-5", label: "PM vs Balen" },
  { constituency: "Chitwan-2", label: "Rabi's Turf" },
  { constituency: "Kathmandu-1", label: "KTM-1" },
  { constituency: "Kathmandu-8", label: "KTM-8" },
  { constituency: "Rupandehi-4", label: "Rupandehi-4" },
  { constituency: "Bhaktapur-1", label: "Bhaktapur-1" },
];

function FeaturedRaceCard({
  race,
  data,
  isChanged,
}: {
  race: { constituency: string; label: string };
  data: ConstituencyVoteData | undefined;
  isChanged: boolean;
}) {
  const candidates = data ? [...data.candidates].sort((a, b) => b.votes - a.votes).slice(0, 3) : [];
  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0);
  const hasWinner = candidates.some((c) => c.isWinner);
  const isDeclared = data?.status === "DECLARED";

  return (
    <div className={`shrink-0 w-56 md:w-64 rounded-xl border overflow-hidden transition-all ${
      hasWinner || isDeclared
        ? "border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20 bg-slate-900/90"
        : isChanged
        ? "border-emerald-500/50 vote-flash card-shake bg-slate-900/80"
        : "border-slate-700/50 hover:border-slate-600/50 bg-slate-900/80"
    }`}>
      {/* Progress bar */}
      {totalVotes > 0 && (
        <div className={`h-1.5 flex overflow-hidden ${hasWinner ? "h-2" : ""}`}>
          {candidates.filter((c) => c.votes > 0).map((c, i) => (
            <div
              key={i}
              className="progress-segment"
              style={{
                width: `${(c.votes / totalVotes) * 100}%`,
                backgroundColor: c.isWinner ? "#f59e0b" : c.color || "#6b7280",
              }}
            />
          ))}
        </div>
      )}
      {totalVotes === 0 && <div className="h-1.5 bg-slate-800" />}

      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <span className="text-[11px] font-bold text-white truncate">
            {hasWinner && <span className="mr-1">🏆</span>}
            {race.label}
          </span>
          {data && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${
              hasWinner || isDeclared
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : statusColor(data.status)
            }`}>
              {hasWinner ? "Winner" : statusLabel(data.status)}
            </span>
          )}
        </div>
        <div className="space-y-1">
          {candidates.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="shrink-0 px-1 py-0.5 rounded text-[8px] font-bold text-white"
                style={{ backgroundColor: (c.color || "#6b7280") + "cc" }}
              >
                {c.partyShort}
              </span>
              <span className={`text-[11px] truncate flex-1 ${
                c.isWinner ? "text-amber-200 font-semibold" : i === 0 && c.votes > 0 ? "text-white font-medium" : "text-slate-400"
              }`}>
                {c.name}
              </span>
              {c.isWinner && <span className="text-[10px]">🏆</span>}
              <AnimatedNumber
                value={c.votes}
                className={`text-[11px] font-bold tabular-nums shrink-0 ${
                  c.isWinner ? "text-amber-400" : i === 0 && c.votes > 0 ? "text-emerald-400" : c.votes > 0 ? "text-slate-300" : "text-slate-600"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Constituency Card ----

function ConstituencyCard({
  constituency,
  isChanged,
  recentTime,
}: {
  constituency: ConstituencyVoteData;
  isChanged: boolean;
  recentTime?: number;
}) {
  const isRecent = recentTime ? Date.now() - recentTime < RECENT_WINDOW_MS : false;
  const totalVotes = constituency.candidates.reduce((sum, c) => sum + c.votes, 0);
  const maxVotes = constituency.candidates.length > 0
    ? [...constituency.candidates].sort((a, b) => b.votes - a.votes)[0]?.votes || 0
    : 0;
  const sorted = [...constituency.candidates].sort((a, b) => b.votes - a.votes);
  const topCandidates = sorted.slice(0, 5);
  const remaining = sorted.length - 5;
  const hasWinner = constituency.candidates.some((c) => c.isWinner);
  const isDeclared = constituency.status === "DECLARED";

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-300 ${
        hasWinner || isDeclared
          ? "border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20 bg-slate-900/90"
          : isChanged
          ? "border-emerald-500/60 shadow-lg shadow-emerald-500/20 vote-flash ring-1 ring-emerald-500/30 card-shake"
          : isRecent
          ? "border-emerald-500/25 shadow-md shadow-emerald-500/5"
          : "border-slate-700/50 hover:border-slate-600/50"
      } ${!hasWinner && !isDeclared ? "bg-slate-900/80" : ""}`}
    >
      {/* Progress bar */}
      {totalVotes > 0 ? (
        <div className="h-2 flex overflow-hidden">
          {sorted.filter((c) => c.votes > 0).map((c, i) => (
            <div
              key={i}
              className="progress-segment"
              style={{
                width: `${(c.votes / totalVotes) * 100}%`,
                backgroundColor: c.color || PARTY_COLORS[c.party] || "#6b7280",
              }}
              title={`${c.partyShort}: ${formatNumber(c.votes)}`}
            />
          ))}
        </div>
      ) : (
        <div className="h-2 bg-slate-800" />
      )}

      {/* Header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {hasWinner && <span className="text-base shrink-0">🏆</span>}
            <h3 className="text-sm font-bold text-white truncate">{constituency.constituency}</h3>
            {isRecent && recentTime && (
              <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 live-blink">
                UPDATED {timeAgo(recentTime)}
              </span>
            )}
          </div>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
            hasWinner
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
              : statusColor(constituency.status)
          }`}>
            {hasWinner ? "🏆 Declared" : statusLabel(constituency.status)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {constituency.votesCast > 0 ? (
            <>
              <span className="text-xs text-slate-400">
                <AnimatedNumber value={constituency.votesCast} className="text-xs text-slate-400" /> of {formatNumber(constituency.totalVoters)} votes
              </span>
              <span className="text-[10px] text-slate-500">
                ({Math.round((constituency.votesCast / constituency.totalVoters) * 100)}%)
              </span>
            </>
          ) : totalVotes > 0 ? (
            <span className="text-xs text-slate-400">
              <AnimatedNumber value={totalVotes} className="text-xs text-slate-400" /> votes counted
            </span>
          ) : (
            <span className="text-xs text-slate-500">Awaiting results</span>
          )}
        </div>
      </div>

      {/* Candidates */}
      <div className="px-3 pb-3 space-y-1">
        {topCandidates.map((candidate, idx) => {
          const isLeading = idx === 0 && candidate.votes > 0;
          const barWidth = maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0;
          const isWinner = candidate.isWinner;

          return (
            <div
              key={idx}
              className={`relative rounded-lg px-3 py-2 ${
                isWinner
                  ? "bg-amber-500/10 border border-amber-500/30 ring-1 ring-amber-400/20"
                  : isLeading
                  ? "bg-emerald-500/8 border border-emerald-500/15"
                  : "bg-slate-800/40"
              }`}
            >
              {candidate.votes > 0 && (
                <div
                  className="absolute inset-y-0 left-0 rounded-lg opacity-10 progress-segment"
                  style={{ width: `${barWidth}%`, backgroundColor: isWinner ? "#f59e0b" : candidate.color || "#6b7280" }}
                />
              )}
              <div className="relative flex items-center gap-2">
                <span
                  className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: (candidate.color || "#6b7280") + "cc" }}
                >
                  {candidate.partyShort}
                </span>
                <span className={`text-xs truncate flex-1 ${
                  isWinner ? "text-amber-200 font-semibold" : isLeading ? "text-white font-medium" : "text-slate-300"
                }`}>
                  {candidate.name}
                </span>
                {candidate.votes > 0 ? (
                  <AnimatedNumber
                    value={candidate.votes}
                    className={`text-xs font-bold tabular-nums shrink-0 ${
                      isWinner ? "text-amber-400" : isLeading ? "text-emerald-400" : "text-slate-300"
                    } ${isChanged ? "vote-count-update" : ""}`}
                  />
                ) : (
                  <span className="text-xs text-slate-600 shrink-0">-</span>
                )}
                {isWinner && (
                  <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40">
                    <span className="text-sm">🏆</span>
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wide">Winner</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {remaining > 0 && (
          <p className="text-[10px] text-slate-500 text-center pt-1">
            +{remaining} more candidate{remaining > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ---- Main ListView ----

type FilterStatus = "all" | "DECLARED" | "COUNTING" | "PENDING";

export default function ListView({ constituencies, changedConstituencies, recentlyUpdated, onSelectDistrict }: ListViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when constituencies get new data
  useEffect(() => {
    if (changedConstituencies.size > 0 && gridScrollRef.current) {
      gridScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [changedConstituencies]);

  // Build district→province lookup from electionData
  const districtProvinceMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of electionData) {
      map[d.district.toUpperCase()] = d.province;
    }
    return map;
  }, []);

  // Build province → districts from constituencies
  const provinceDistricts = useMemo(() => {
    const map: Record<number, Set<string>> = {};
    for (const c of constituencies) {
      const prov = districtProvinceMap[c.district] || 0;
      if (!map[prov]) map[prov] = new Set();
      map[prov].add(c.district);
    }
    return map;
  }, [constituencies, districtProvinceMap]);

  // Get leading parties across all constituencies
  const partyLeadership = useMemo(() => {
    const counts: Record<string, { party: string; short: string; color: string; count: number }> = {};
    for (const c of constituencies) {
      if (c.candidates.length === 0) continue;
      const sorted = [...c.candidates].sort((a, b) => b.votes - a.votes);
      if (sorted[0].votes > 0) {
        const p = sorted[0].party;
        if (!counts[p]) counts[p] = { party: p, short: sorted[0].partyShort, color: sorted[0].color, count: 0 };
        counts[p].count++;
      }
    }
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [constituencies]);

  // Featured race data lookup
  const featuredData = useMemo(() => {
    const map: Record<string, ConstituencyVoteData> = {};
    for (const c of constituencies) {
      map[c.constituency] = c;
    }
    return map;
  }, [constituencies]);

  // Handle province click
  const handleProvinceClick = useCallback((prov: number) => {
    if (selectedProvince === prov) {
      setSelectedProvince(null);
      setSelectedDistrict(null);
    } else {
      setSelectedProvince(prov);
      setSelectedDistrict(null);
    }
  }, [selectedProvince]);

  // Handle district click
  const handleDistrictClick = useCallback((district: string) => {
    setSelectedDistrict(selectedDistrict === district ? null : district);
  }, [selectedDistrict]);

  // Handle party click
  const handlePartyClick = useCallback((party: string) => {
    setSelectedParty(selectedParty === party ? null : party);
  }, [selectedParty]);

  // Filter constituencies
  const filtered = useMemo(() => {
    let result = constituencies;

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (selectedProvince !== null) {
      result = result.filter((c) => districtProvinceMap[c.district] === selectedProvince);
    }

    if (selectedDistrict) {
      result = result.filter((c) => c.district === selectedDistrict);
    }

    if (selectedParty) {
      result = result.filter((c) => {
        if (c.candidates.length === 0) return false;
        const sorted = [...c.candidates].sort((a, b) => b.votes - a.votes);
        return sorted[0].votes > 0 && sorted[0].party === selectedParty;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.constituency.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.candidates.some((cand) => cand.name.toLowerCase().includes(q))
      );
    }

    const now = Date.now();
    const statusOrder: Record<string, number> = { DECLARED: 0, COUNTING: 1, PENDING: 2 };
    result = [...result].sort((a, b) => {
      // Recently updated cards float to top
      const aRecent = recentlyUpdated[a.constituency] && now - recentlyUpdated[a.constituency] < RECENT_WINDOW_MS;
      const bRecent = recentlyUpdated[b.constituency] && now - recentlyUpdated[b.constituency] < RECENT_WINDOW_MS;
      if (aRecent && !bRecent) return -1;
      if (!aRecent && bRecent) return 1;
      // If both recent, sort by most recently updated first
      if (aRecent && bRecent) {
        return (recentlyUpdated[b.constituency] || 0) - (recentlyUpdated[a.constituency] || 0);
      }

      const sa = statusOrder[a.status] ?? 3;
      const sb = statusOrder[b.status] ?? 3;
      if (sa !== sb) return sa - sb;
      const va = a.candidates.reduce((s, c) => s + c.votes, 0);
      const vb = b.candidates.reduce((s, c) => s + c.votes, 0);
      return vb - va;
    });

    return result;
  }, [constituencies, search, statusFilter, selectedProvince, selectedDistrict, selectedParty, districtProvinceMap, recentlyUpdated]);

  // Stats
  const declared = constituencies.filter((c) => c.status === "DECLARED").length;
  const counting = constituencies.filter((c) => c.status === "COUNTING").length;
  const pending = constituencies.filter((c) => c.status === "PENDING").length;
  const totalVotesCast = constituencies.reduce((s, c) => s + c.votesCast, 0);
  const totalVoters = constituencies.reduce((s, c) => s + c.totalVoters, 0);
  const turnout = totalVoters > 0 ? Math.round((totalVotesCast / totalVoters) * 100) : 0;

  // Active filter count for clear button
  const activeFilters = [
    selectedProvince !== null,
    selectedDistrict !== null,
    selectedParty !== null,
    statusFilter !== "all",
    search.trim() !== "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedParty(null);
  };

  // Districts for sidebar (filtered by province if selected)
  const sidebarDistricts = useMemo(() => {
    if (selectedProvince === null) return [];
    const dists = provinceDistricts[selectedProvince];
    return dists ? Array.from(dists).sort() : [];
  }, [selectedProvince, provinceDistricts]);

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Featured Races */}
      <div className="shrink-0 border-b border-slate-800/50 px-3 md:px-4 py-3">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Races</p>
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {FEATURED_RACES.map((race) => (
            <FeaturedRaceCard
              key={race.constituency}
              race={race}
              data={featuredData[race.constituency]}
              isChanged={changedConstituencies.has(race.constituency)}
            />
          ))}
        </div>
      </div>

      {/* Main content: grid + sidebar */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: filters + cards */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Filters bar */}
          <div className="shrink-0 px-3 md:px-4 py-3 border-b border-slate-800/50 space-y-2.5">
            {/* Search + Clear */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search candidate, constituency, or district..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
                >
                  Clear ({activeFilters})
                </button>
              )}
            </div>

            {/* Status filters */}
            <div className="flex gap-1.5 flex-wrap">
              {([
                { key: "all" as FilterStatus, label: `All (${constituencies.length})`, style: "blue" },
                { key: "DECLARED" as FilterStatus, label: `Declared (${declared})`, style: "emerald" },
                { key: "COUNTING" as FilterStatus, label: `Counting (${counting})`, style: "amber" },
                { key: "PENDING" as FilterStatus, label: `Pending (${pending})`, style: "slate" },
              ] as const).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === f.key
                      ? f.style === "blue" ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                      : f.style === "emerald" ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                      : f.style === "amber" ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30"
                      : "bg-slate-600/30 text-slate-300 ring-1 ring-slate-500/30"
                      : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card grid */}
          <div ref={gridScrollRef} className="flex-1 overflow-y-auto p-3 md:p-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2">
                <p className="text-slate-500 text-sm">No constituencies found</p>
                {activeFilters > 0 && (
                  <button onClick={clearFilters} className="text-xs text-blue-400 hover:text-blue-300">
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="text-[10px] text-slate-500 mb-3">
                  Showing {filtered.length} of {constituencies.length} constituencies
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3">
                  {filtered.map((c) => (
                    <ConstituencyCard
                      key={c.constituency}
                      constituency={c}
                      isChanged={changedConstituencies.has(c.constituency)}
                      recentTime={recentlyUpdated[c.constituency]}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar — desktop only */}
        <aside className="hidden xl:flex w-72 flex-col border-l border-slate-800/50 bg-slate-900/50">
          <div className="flex-1 overflow-y-auto">
            {/* Quick Stats */}
            <div className="p-4 border-b border-slate-800/50">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Overview</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                  <AnimatedNumber value={totalVotesCast} className="text-base font-bold text-white" />
                  <p className="text-[10px] text-slate-400 mt-0.5">Votes Cast</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                  <p className="text-base font-bold text-white">{turnout}%</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Turnout</p>
                </div>
                <div className="bg-emerald-500/10 rounded-lg p-2.5 text-center">
                  <p className="text-base font-bold text-emerald-400">{declared}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Declared</p>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-2.5 text-center">
                  <p className="text-base font-bold text-amber-400">{counting}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Counting</p>
                </div>
              </div>
            </div>

            {/* Leading Parties */}
            {partyLeadership.length > 0 && (
              <div className="p-4 border-b border-slate-800/50">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Leading Parties</p>
                <div className="space-y-1.5">
                  {partyLeadership.slice(0, 8).map((p) => (
                    <button
                      key={p.party}
                      onClick={() => handlePartyClick(p.party)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                        selectedParty === p.party
                          ? "bg-slate-700/80 ring-1 ring-slate-600"
                          : "hover:bg-slate-800/60"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-slate-300 truncate flex-1">{p.short}</span>
                      <span className="text-xs text-slate-500 tabular-nums">{p.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Province Filter */}
            <div className="p-4 border-b border-slate-800/50">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Provinces</p>
              <div className="space-y-1">
                {Object.entries(PROVINCE_NAMES).map(([key, name]) => {
                  const prov = Number(key);
                  const distCount = provinceDistricts[prov]?.size || 0;
                  return (
                    <button
                      key={prov}
                      onClick={() => handleProvinceClick(prov)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${
                        selectedProvince === prov
                          ? "bg-slate-700/80 ring-1 ring-slate-600"
                          : "hover:bg-slate-800/60"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PROVINCE_COLORS[prov] }} />
                      <span className="text-xs text-slate-300 truncate flex-1">{name.replace(" Pradesh", "")}</span>
                      <span className="text-[10px] text-slate-500">{distCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* District List (when province is selected) */}
            {selectedProvince !== null && sidebarDistricts.length > 0 && (
              <div className="p-4">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Districts — {PROVINCE_NAMES[selectedProvince]?.replace(" Pradesh", "")}
                </p>
                <div className="space-y-0.5">
                  {sidebarDistricts.map((dist) => {
                    const zoneCount = constituencies.filter((c) => c.district === dist).length;
                    const countingZones = constituencies.filter((c) => c.district === dist && c.status === "COUNTING").length;
                    return (
                      <button
                        key={dist}
                        onClick={() => handleDistrictClick(dist)}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${
                          selectedDistrict === dist
                            ? "bg-slate-700/80 ring-1 ring-slate-600"
                            : "hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-xs text-slate-300 truncate flex-1">{titleCase(dist)}</span>
                        <span className="flex items-center gap-1.5">
                          {countingZones > 0 && (
                            <span className="text-[9px] text-amber-400 font-medium">{countingZones} live</span>
                          )}
                          <span className="text-[10px] text-slate-500">{zoneCount}z</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
