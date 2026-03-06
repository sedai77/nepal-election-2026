import { NextResponse } from "next/server";
import { parse } from "node-html-parser";
import { PARTY_COLORS } from "@/data/electionData";

// ---- Data Sources ----
const R2_URL = "https://pub-4173e04d0b78426caa8cfa525f827daa.r2.dev/constituencies.json";
const R2_FALLBACK_URL = "https://pub-4173e04d0b78426caa8cfa525f827daa.r2.dev/constituencies.last_good.json";
const EKANTIPUR_URL = "https://election.ekantipur.com/popular-candidates?lng=eng";
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

// ---- Nepali party name → English mapping via keywords ----

function mapPartyName(nepaliName: string): { name: string; short: string } {
  const n = nepaliName;

  if (n.includes("काँग्रेस")) return { name: "Nepali Congress", short: "NC" };
  if (n.includes("एकीकृत मार्क्सवादी") || n.includes("एमाले"))
    return { name: "CPN-UML", short: "UML" };
  if (n.includes("माओवादी")) return { name: "CPN (Maoist Centre)", short: "Maoist" };
  if (n.includes("एकीकृत समाजवादी")) return { name: "CPN (Unified Socialist)", short: "CPN-US" };
  if (n.includes("स्वतन्त्र") && n.includes("पार्टी"))
    return { name: "Rastriya Swatantra Party", short: "RSP" };
  if (n.includes("प्रजातन्त्र")) return { name: "Rastriya Prajatantra Party", short: "RPP" };
  if (n.includes("लोकतान्त्रिक") && n.includes("समाजवादी"))
    return { name: "Loktantrik Samajwadi Party", short: "LSP" };
  if (n.includes("जनता") && n.includes("समाजवादी"))
    return { name: "Janata Samajwadi Party", short: "JSP" };
  if (n.includes("जनमत")) return { name: "Janamat Party", short: "JP" };
  if (n.includes("नागरिक उन्मुक्ति")) return { name: "Nagarik Unmukti Party", short: "NUP" };
  if (n.includes("मजदुर") || n.includes("किसान"))
    return { name: "Nepal Workers and Peasants Party", short: "NWPP" };
  if (n.includes("जनमोर्चा")) return { name: "Rastriya Janamorcha", short: "RJM" };
  if (n === "स्वतन्त्र") return { name: "Independent", short: "IND" };

  return { name: nepaliName, short: nepaliName.substring(0, 6) };
}

// ---- District name normalization ----

const DISTRICT_NAME_MAP: Record<string, string> = {
  "RUKUM EAST": "EASTERN RUKUM",
  "RUKUM WEST": "WESTERN RUKUM",
  "RUKUMEAST": "EASTERN RUKUM",
  "RUKUMWEST": "WESTERN RUKUM",
};

function normalizeDistrict(name: string): string {
  const upper = name.toUpperCase().trim();
  return DISTRICT_NAME_MAP[upper] || upper;
}

// ---- Ekantipur party mapping ----

function getEkantipurPartyShort(party: string): string {
  const map: Record<string, string> = {
    "Nepali Congress": "NC",
    "CPN-UML": "UML",
    "Rastriya Swatantra Party": "RSP",
    "Rastriya Swotantra Party": "RSP",
    "CPN (Maoist Centre)": "Maoist",
    "CPN-Maoist Centre": "Maoist",
    "Rastriya Prajatantra Party": "RPP",
    "Janata Samajwadi Party": "JSP",
    "Janata Samajbadi Party": "JSP",
    "CPN-Unified Socialist": "CPN-US",
    "CPN (Unified Socialist)": "CPN-US",
    "Janamat Party": "JP",
    "Loktantrik Samajwadi Party": "LSP",
    "Loktantrik Samajbadi Party": "LSP",
    "Nagarik Unmukti Party": "NUP",
    "Independent": "IND",
    "Nepali Communist Party": "NCP",
  };
  return map[party] || party.substring(0, 4).toUpperCase();
}

function normalizeEkantipurParty(party: string): string {
  const map: Record<string, string> = {
    "Rastriya Swotantra Party": "Rastriya Swatantra Party",
    "Rastirya Swatantra Party": "Rastriya Swatantra Party",
  };
  return map[party] || party;
}

function parseConstituency(name: string): { district: string; zone: number } {
  const match = name.match(/^(.+?)-(\d+)$/);
  if (!match) return { district: name.toUpperCase(), zone: 0 };
  const district = match[1].trim().toUpperCase().replace(/\s+/g, " ");
  const zone = parseInt(match[2]);
  return { district: DISTRICT_NAME_MAP[district] || district, zone };
}

// ---- R2 data types ----

interface R2Candidate {
  candidateId: number;
  name: string;
  nameNp: string;
  partyName: string;
  partyId: string;
  votes: number;
  gender: string;
  isWinner: boolean;
}

interface R2Constituency {
  province: string;
  district: string;
  districtNp: string;
  code: string;
  name: string;
  nameNp: string;
  status: "PENDING" | "COUNTING" | "DECLARED";
  lastUpdated: string;
  votesCast: number;
  totalVoters: number;
  candidates: R2Candidate[];
}

// ---- Ekantipur supplementary data ----

interface EkantipurVotes {
  candidates: { name: string; votes: number; party: string }[];
}

// ---- Output types ----

interface CandidateResult {
  name: string;
  votes: number;
  party: string;
  partyShort: string;
  color: string;
  isWinner: boolean;
}

interface ConstituencyResult {
  constituency: string;
  district: string;
  zone: number;
  status: string;
  totalVoters: number;
  votesCast: number;
  lastUpdated: string;
  candidates: CandidateResult[];
}

interface CachedData {
  constituencies: ConstituencyResult[];
  topCandidates: {
    district: string;
    zone: number;
    candidate_name: string;
    party: string;
    party_short: string;
    count: number;
  }[];
  sentiment: Record<string, { party: string; partyShort: string; color: string; totalLikes: number }>;
  totalVotes: number;
  lastUpdated: number;
}

let cache: CachedData | null = null;
let lastFetch = 0;

function parseZone(name: string): number {
  const match = name.match(/-(\d+)$/);
  return match ? parseInt(match[1]) : 0;
}

// ---- Fetch R2 data (primary source: Election Commission) ----

async function fetchR2Data(): Promise<R2Constituency[]> {
  let res = await fetch(R2_URL, { cache: "no-store" });
  if (!res.ok) {
    res = await fetch(R2_FALLBACK_URL, { cache: "no-store" });
  }
  if (!res.ok) {
    throw new Error(`R2 fetch failed: ${res.status}`);
  }
  return res.json();
}

// ---- Fetch Ekantipur data (supplementary: faster updates) ----

async function fetchEkantipurData(): Promise<Record<string, EkantipurVotes>> {
  try {
    const res = await fetch(EKANTIPUR_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ElectionTracker/1.0)",
        Accept: "text/html",
      },
      cache: "no-store",
    });

    if (!res.ok) return {};

    const html = await res.text();
    const root = parse(html);
    const wrappers = root.querySelectorAll(".popular-candidate-card-wrapper");
    const data: Record<string, EkantipurVotes> = {};

    for (const wrapper of wrappers) {
      const headerLink = wrapper.querySelector(".popular-candidate-header a");
      const constituencyName = headerLink?.textContent?.trim() || "";
      if (!constituencyName) continue;

      const candidates: { name: string; votes: number; party: string }[] = [];

      // Main candidate
      const mainCard = wrapper.querySelector(".candidate-card");
      if (mainCard) {
        const name = mainCard.querySelector("h5")?.textContent?.trim() || "";
        const voteP = mainCard.querySelector(".vote-count p");
        const votes = voteP ? parseInt(voteP.textContent.trim().replace(/,/g, "")) || 0 : 0;
        candidates.push({ name, votes, party: "" });
      }

      // Other candidates
      const items = wrapper.querySelectorAll(".candidate-items");
      for (const item of items) {
        const nameP = item.querySelector(".candidate-name p");
        const voteP = item.querySelector(".vote-count p");
        const partySpan = item.querySelector(".party-image span");

        const name = nameP?.textContent?.trim() || "";
        const votes = voteP ? parseInt(voteP.textContent.trim().replace(/,/g, "")) || 0 : 0;
        const party = partySpan?.textContent?.trim() || "";

        if (candidates.length > 0 && candidates[0].party === "" && name === candidates[0].name) {
          candidates[0].party = party;
          candidates[0].votes = Math.max(candidates[0].votes, votes);
        } else {
          candidates.push({ name, votes, party });
        }
      }

      data[constituencyName] = { candidates };
    }

    return data;
  } catch (error) {
    console.error("Ekantipur scrape error:", error);
    return {};
  }
}

// ---- Merge and transform data ----

function transformData(
  r2Data: R2Constituency[],
  ekData: Record<string, EkantipurVotes>
): CachedData {
  const constituencies: ConstituencyResult[] = [];

  for (const c of r2Data) {
    const district = normalizeDistrict(c.district);
    const zone = parseZone(c.name);

    const candidates: CandidateResult[] = c.candidates.map((cand) => {
      const mapped = mapPartyName(cand.partyName);
      return {
        name: cand.name,
        votes: cand.votes,
        party: mapped.name,
        partyShort: mapped.short,
        color: PARTY_COLORS[mapped.name] || "#6b7280",
        isWinner: cand.isWinner,
      };
    });

    let status = c.status;
    let votesCast = c.votesCast;

    // Merge ekantipur data for constituencies where R2 has no votes
    const r2TotalVotes = candidates.reduce((s, cand) => s + cand.votes, 0);
    if (r2TotalVotes === 0) {
      // Try to find matching ekantipur data
      const ekKey = c.name; // e.g. "Jhapa-5"
      const ekEntry = ekData[ekKey];
      if (ekEntry && ekEntry.candidates.some((ec) => ec.votes > 0)) {
        // Merge ekantipur vote data into R2 candidates by fuzzy name matching
        for (const ekCand of ekEntry.candidates) {
          if (ekCand.votes === 0) continue;
          // Find matching candidate in R2 data
          const lastName = ekCand.name.split(" ").pop()?.toLowerCase() || "";
          const match = candidates.find((rc) => {
            if (rc.name.toLowerCase() === ekCand.name.toLowerCase()) return true;
            const rcLast = rc.name.split(" ").pop()?.toLowerCase() || "";
            return rcLast === lastName && lastName.length > 2;
          });
          if (match) {
            match.votes = Math.max(match.votes, ekCand.votes);
            // Fill in party if ekantipur has it and R2 doesn't
            if (ekCand.party && match.party === match.name) {
              const normalized = normalizeEkantipurParty(ekCand.party);
              match.party = normalized;
              match.partyShort = getEkantipurPartyShort(normalized);
              match.color = PARTY_COLORS[normalized] || "#6b7280";
            }
          }
        }
        // Update status since ekantipur shows votes
        if (status === "PENDING") {
          status = "COUNTING";
        }
        // Calculate votesCast from ekantipur data
        const ekTotalVotes = candidates.reduce((s, cand) => s + cand.votes, 0);
        if (ekTotalVotes > votesCast) {
          votesCast = ekTotalVotes;
        }
      }
    }

    // Sort candidates by votes (descending)
    candidates.sort((a, b) => b.votes - a.votes);

    // ---- Hardcoded winners (remove when EC data catches up) ----
    if (c.name === "Kathmandu-1") {
      for (const cand of candidates) {
        if (cand.name.toLowerCase().includes("ranju")) {
          cand.isWinner = true;
          status = "DECLARED";
          break;
        }
      }
    }

    constituencies.push({
      constituency: c.name,
      district,
      zone,
      status,
      totalVoters: c.totalVoters,
      votesCast,
      lastUpdated: c.lastUpdated,
      candidates,
    });
  }

  // Build top candidates
  const allCandidates = constituencies.flatMap((c) =>
    c.candidates
      .filter((cand) => cand.votes > 0)
      .map((cand) => ({
        district: c.district,
        zone: c.zone,
        candidate_name: cand.name,
        party: cand.party,
        party_short: cand.partyShort,
        count: cand.votes,
      }))
  );
  allCandidates.sort((a, b) => b.count - a.count);
  const topCandidates = allCandidates.slice(0, 20);

  // Build district sentiment (leading party per district)
  const districtPartyVotes: Record<
    string,
    Record<string, { party: string; partyShort: string; totalVotes: number }>
  > = {};
  for (const c of constituencies) {
    if (!districtPartyVotes[c.district]) districtPartyVotes[c.district] = {};
    for (const cand of c.candidates) {
      const key = cand.party;
      if (!districtPartyVotes[c.district][key]) {
        districtPartyVotes[c.district][key] = {
          party: cand.party,
          partyShort: cand.partyShort,
          totalVotes: 0,
        };
      }
      districtPartyVotes[c.district][key].totalVotes += cand.votes;
    }
  }

  const sentiment: CachedData["sentiment"] = {};
  for (const [district, parties] of Object.entries(districtPartyVotes)) {
    const sorted = Object.values(parties).sort((a, b) => b.totalVotes - a.totalVotes);
    const top = sorted[0];
    if (top && top.totalVotes > 0) {
      sentiment[district] = {
        party: top.party,
        partyShort: top.partyShort,
        color: PARTY_COLORS[top.party] || "#6b7280",
        totalLikes: top.totalVotes,
      };
    }
  }

  const totalVotes = allCandidates.reduce((sum, c) => sum + c.count, 0);

  return {
    constituencies,
    topCandidates,
    sentiment,
    totalVotes,
    lastUpdated: Date.now(),
  };
}

async function getCachedData(): Promise<CachedData> {
  const now = Date.now();
  if (cache && now - lastFetch < CACHE_TTL_MS) {
    return cache;
  }

  try {
    // Fetch both sources in parallel
    const [r2Data, ekData] = await Promise.all([fetchR2Data(), fetchEkantipurData()]);
    const data = transformData(r2Data, ekData);
    cache = data;
    lastFetch = now;
    return data;
  } catch (error) {
    console.error("Election data fetch error:", error);
    if (cache) return cache;
    return {
      constituencies: [],
      topCandidates: [],
      sentiment: {},
      totalVotes: 0,
      lastUpdated: 0,
    };
  }
}

export async function GET() {
  const data = await getCachedData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    },
  });
}
