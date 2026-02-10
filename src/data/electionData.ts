import candidatesData from "./candidates.json";

export interface Candidate {
  name: string;
  party: string;
  partyShort: string;
  color: string;
}

export interface ElectionZone {
  zone: number;
  candidates: Candidate[];
}

export interface DistrictData {
  district: string;
  province: number;
  hq: string;
  zones: ElectionZone[];
  totalVoters?: number;
}

export const PROVINCE_NAMES: Record<number, string> = {
  1: "Koshi Pradesh",
  2: "Madhesh Pradesh",
  3: "Bagmati Pradesh",
  4: "Gandaki Pradesh",
  5: "Lumbini Pradesh",
  6: "Karnali Pradesh",
  7: "Sudurpashchim Pradesh",
};

export const PROVINCE_COLORS: Record<number, string> = {
  1: "#2563eb",
  2: "#dc2626",
  3: "#059669",
  4: "#7c3aed",
  5: "#d97706",
  6: "#0891b2",
  7: "#be185d",
};

export const PARTY_COLORS: Record<string, string> = {
  // Nepali Congress — green tree on flag, party identity is GREEN
  "Nepali Congress": "#16a34a",
  // CPN-UML — red sun symbol, party identity is RED
  "CPN-UML": "#dc2626",
  "Nepali Communist Party": "#991b1b",
  // Rastriya Swatantra Party — sky blue flag
  "Rastriya Swotantra Party": "#0ea5e9",
  "Rastriya Swatantra Party": "#0ea5e9",
  // CPN (Maoist Centre) — dark crimson / maroon
  "CPN (Maoist Centre)": "#b91c1c",
  "CPN-Maoist Centre": "#b91c1c",
  // Rastriya Prajatantra Party — golden/crown yellow
  "Rastriya Prajatantra Party": "#ca8a04",
  // Janata Samajwadi Party — green
  "Janata Samajwadi Party": "#059669",
  "Janata Samajbadi Party": "#059669",
  // CPN (Unified Socialist) — red-violet
  "CPN-Unified Socialist": "#9333ea",
  "CPN (Unified Socialist)": "#9333ea",
  // Janamat Party — teal
  "Janamat Party": "#0d9488",
  // Loktantrik Samajwadi Party — orange
  "Loktantrik Samajwadi Party": "#ea580c",
  "Loktantrik Samajbadi Party": "#ea580c",
  // Nagarik Unmukti Party — lime green
  "Nagarik Unmukti Party": "#65a30d",
  // Nepal Workers and Peasants Party — deep red
  "Nepal Workers and Peasants Party": "#7f1d1d",
  // Rastriya Janamorcha — brown/maroon
  "Rastriya Janamorcha": "#92400e",
  Independent: "#6b7280",
};

// Load real candidate data from scraped JSON
// Source: https://knowyourcandidate.nepabrita.com/candidates/
// Data scraped on 2026-02-09 - Nepal Election 2082 (2026 AD)
export const electionData: DistrictData[] = candidatesData as DistrictData[];

export function getDistrictData(districtName: string): DistrictData | undefined {
  const normalized = districtName.toUpperCase().trim();
  return electionData.find((d) => d.district.toUpperCase() === normalized);
}

export function getDistrictsByProvince(province: number): DistrictData[] {
  return electionData.filter((d) => d.province === province);
}
