"use client";

import Link from "next/link";
import { electionData, PROVINCE_NAMES, PROVINCE_COLORS, PARTY_COLORS } from "@/data/electionData";
import { getPartyGlobalStats, getPartyDistrictDominance, getUniqueParties } from "@/data/partyUtils";
import CountdownTimer from "@/components/CountdownTimer";

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function BarChart({ data, maxValue, label }: { data: { name: string; value: number; color: string }[]; maxValue: number; label: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">{label}</h3>
      {data.map((item, i) => (
        <div key={i} className="group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300 truncate max-w-[200px]">{item.name}</span>
            <span className="text-xs font-bold text-white ml-2">{item.value}</span>
          </div>
          <div className="h-6 bg-slate-800/60 rounded-lg overflow-hidden">
            <div
              className="h-full rounded-lg transition-all duration-700 ease-out flex items-center px-2"
              style={{
                width: `${Math.max((item.value / maxValue) * 100, 4)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, gradient }: {
  title: string; value: string | number; subtitle?: string; icon: React.ReactNode; gradient: string;
}) {
  return (
    <div className={`rounded-2xl p-5 ${gradient} border border-white/5 relative overflow-hidden`}>
      <div className="absolute top-3 right-3 opacity-20">{icon}</div>
      <p className="text-sm text-white/70 font-medium">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      {subtitle && <p className="text-xs text-white/50 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function StatsPage() {
  const partyStats = getPartyGlobalStats();
  const dominanceStats = getPartyDistrictDominance();
  const uniqueParties = getUniqueParties();

  const totalCandidates = electionData.reduce(
    (acc, d) => acc + d.zones.reduce((a, z) => a + z.candidates.length, 0), 0
  );
  const totalZones = electionData.reduce((acc, d) => acc + d.zones.length, 0);

  // Province stats
  const provinceStats = Object.entries(PROVINCE_NAMES).map(([key, name]) => {
    const p = Number(key);
    const districts = electionData.filter((d) => d.province === p);
    const zones = districts.reduce((a, d) => a + d.zones.length, 0);
    const candidates = districts.reduce(
      (a, d) => a + d.zones.reduce((aa, z) => aa + z.candidates.length, 0), 0
    );
    return { province: p, name, districts: districts.length, zones, candidates };
  });

  // District extremes
  const districtsByZones = [...electionData].sort((a, b) => b.zones.length - a.zones.length);
  const mostZones = districtsByZones.slice(0, 5);
  const fewestZones = districtsByZones.slice(-5).reverse();

  // Candidates per zone distribution
  const avgCandidatesPerZone = (totalCandidates / totalZones).toFixed(1);

  // Most competitive zones (most candidates)
  const allZones = electionData.flatMap((d) =>
    d.zones.map((z) => ({ district: d.district, zone: z.zone, candidates: z.candidates.length }))
  );
  const mostCompetitive = [...allZones].sort((a, b) => b.candidates - a.candidates).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">Election Statistics</h1>
              <p className="text-xs text-slate-400">Nepal Election 2026 — Data Overview</p>
            </div>
          </div>
          <CountdownTimer />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Districts"
            value={electionData.length}
            subtitle="Across 7 provinces"
            gradient="bg-gradient-to-br from-blue-600/20 to-blue-800/10"
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>}
          />
          <StatCard
            title="Election Zones"
            value={totalZones}
            subtitle="Constituencies"
            gradient="bg-gradient-to-br from-purple-600/20 to-purple-800/10"
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
          />
          <StatCard
            title="Total Candidates"
            value={totalCandidates}
            subtitle={`Avg ${avgCandidatesPerZone} per zone`}
            gradient="bg-gradient-to-br from-emerald-600/20 to-emerald-800/10"
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>}
          />
          <StatCard
            title="Political Parties"
            value={uniqueParties.length}
            subtitle="Fielding candidates"
            gradient="bg-gradient-to-br from-amber-600/20 to-amber-800/10"
            icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Candidates by Party */}
          <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-5">
            <BarChart
              label="Candidates by Party"
              data={partyStats.slice(0, 10).map((s) => ({ name: s.party, value: s.count, color: s.color }))}
              maxValue={partyStats[0]?.count || 1}
            />
          </div>

          {/* District Dominance */}
          <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-5">
            <BarChart
              label="Districts Dominated by Party"
              data={dominanceStats.slice(0, 10).map((s) => ({ name: s.party, value: s.count, color: s.color }))}
              maxValue={dominanceStats[0]?.count || 1}
            />
            <p className="text-xs text-slate-500 mt-3">Party with the most candidates in each district</p>
          </div>
        </div>

        {/* Province Breakdown */}
        <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Province Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-2.5 px-3 text-slate-400 font-medium">Province</th>
                  <th className="text-center py-2.5 px-3 text-slate-400 font-medium">Districts</th>
                  <th className="text-center py-2.5 px-3 text-slate-400 font-medium">Zones</th>
                  <th className="text-center py-2.5 px-3 text-slate-400 font-medium">Candidates</th>
                  <th className="text-right py-2.5 px-3 text-slate-400 font-medium hidden sm:table-cell">Avg/Zone</th>
                </tr>
              </thead>
              <tbody>
                {provinceStats.map((ps) => (
                  <tr key={ps.province} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: PROVINCE_COLORS[ps.province] }} />
                        <span className="text-white font-medium">{ps.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-3 text-slate-300">{ps.districts}</td>
                    <td className="text-center py-3 px-3 text-slate-300">{ps.zones}</td>
                    <td className="text-center py-3 px-3">
                      <span className="text-white font-semibold">{ps.candidates}</span>
                    </td>
                    <td className="text-right py-3 px-3 text-slate-400 hidden sm:table-cell">
                      {ps.zones > 0 ? (ps.candidates / ps.zones).toFixed(1) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Most Election Zones */}
          <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Most Election Zones</h3>
            <div className="space-y-2">
              {mostZones.map((d, i) => (
                <Link href={`/?district=${d.district}`} key={d.district} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-slate-500 w-4">{i + 1}.</span>
                    <span className="text-sm text-white group-hover:text-blue-400 transition-colors">{titleCase(d.district)}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{d.zones.length}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Fewest Election Zones */}
          <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Fewest Election Zones</h3>
            <div className="space-y-2">
              {fewestZones.map((d, i) => (
                <Link href={`/?district=${d.district}`} key={d.district} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-slate-500 w-4">{i + 1}.</span>
                    <span className="text-sm text-white group-hover:text-blue-400 transition-colors">{titleCase(d.district)}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{d.zones.length}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Competitive Zones */}
          <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Most Competitive Zones</h3>
            <p className="text-xs text-slate-500 mb-2">Zones with most candidates</p>
            <div className="space-y-2">
              {mostCompetitive.map((z, i) => (
                <Link href={`/?district=${z.district}`} key={`${z.district}-${z.zone}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-slate-500 w-4">{i + 1}.</span>
                    <div>
                      <span className="text-sm text-white group-hover:text-blue-400 transition-colors">{titleCase(z.district)}</span>
                      <span className="text-xs text-slate-400 ml-1">Zone {z.zone}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">{z.candidates}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* All Parties Grid */}
        <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">All Political Parties</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {uniqueParties.map((p) => (
              <div
                key={p.party}
                className="rounded-xl border border-slate-700/30 p-3 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-xs font-medium text-white truncate">{p.party}</span>
                </div>
                <p className="text-2xl font-bold text-white">{p.candidateCount}</p>
                <p className="text-xs text-slate-400">candidates</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
