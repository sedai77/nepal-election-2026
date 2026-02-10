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
  "Nepali Congress": "#e11d48",
  "CPN-UML": "#2563eb",
  "Nepali Communist Party": "#991b1b",
  "Rastriya Swotantra Party": "#f59e0b",
  "Rastriya Swatantra Party": "#f59e0b",
  "CPN (Maoist Centre)": "#dc2626",
  "CPN-Maoist Centre": "#dc2626",
  "Rastriya Prajatantra Party": "#6366f1",
  "Janata Samajwadi Party": "#10b981",
  "Janata Samajbadi Party": "#10b981",
  "CPN-Unified Socialist": "#8b5cf6",
  "CPN (Unified Socialist)": "#8b5cf6",
  "Janamat Party": "#14b8a6",
  "Loktantrik Samajwadi Party": "#f97316",
  "Loktantrik Samajbadi Party": "#f97316",
  "Nagarik Unmukti Party": "#84cc16",
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
