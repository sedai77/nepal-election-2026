import { electionData, PARTY_COLORS, DistrictData } from "./electionData";

export interface PartyStats {
  party: string;
  count: number;
  color: string;
}

/**
 * Get the dominant party in a district (party with most candidates across all zones)
 */
export function getDominantParty(district: DistrictData): PartyStats | null {
  const partyCounts: Record<string, number> = {};

  for (const zone of district.zones) {
    for (const candidate of zone.candidates) {
      partyCounts[candidate.party] = (partyCounts[candidate.party] || 0) + 1;
    }
  }

  let maxParty = "";
  let maxCount = 0;
  for (const [party, count] of Object.entries(partyCounts)) {
    if (count > maxCount) {
      maxCount = count;
      maxParty = party;
    }
  }

  if (!maxParty) return null;
  return {
    party: maxParty,
    count: maxCount,
    color: PARTY_COLORS[maxParty] || "#6b7280",
  };
}

/**
 * Get dominant party color for a district by name
 */
export function getDominantPartyColor(districtName: string): string {
  const district = electionData.find(
    (d) => d.district.toUpperCase() === districtName.toUpperCase()
  );
  if (!district) return "#6b7280";
  const dominant = getDominantParty(district);
  return dominant?.color || "#6b7280";
}

/**
 * Get dominant party name for a district by name
 */
export function getDominantPartyName(districtName: string): string {
  const district = electionData.find(
    (d) => d.district.toUpperCase() === districtName.toUpperCase()
  );
  if (!district) return "Unknown";
  const dominant = getDominantParty(district);
  return dominant?.party || "Unknown";
}

/**
 * Get global stats: total candidates by party across all districts
 */
export function getPartyGlobalStats(): PartyStats[] {
  const partyCounts: Record<string, number> = {};

  for (const district of electionData) {
    for (const zone of district.zones) {
      for (const candidate of zone.candidates) {
        partyCounts[candidate.party] = (partyCounts[candidate.party] || 0) + 1;
      }
    }
  }

  return Object.entries(partyCounts)
    .map(([party, count]) => ({
      party,
      count,
      color: PARTY_COLORS[party] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get the number of districts where each party has the most candidates
 */
export function getPartyDistrictDominance(): PartyStats[] {
  const dominance: Record<string, number> = {};

  for (const district of electionData) {
    const dominant = getDominantParty(district);
    if (dominant) {
      dominance[dominant.party] = (dominance[dominant.party] || 0) + 1;
    }
  }

  return Object.entries(dominance)
    .map(([party, count]) => ({
      party,
      count,
      color: PARTY_COLORS[party] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get unique parties present in the data
 */
export function getUniqueParties(): { party: string; color: string; candidateCount: number }[] {
  const stats = getPartyGlobalStats();
  return stats.map((s) => ({
    party: s.party,
    color: s.color,
    candidateCount: s.count,
  }));
}
