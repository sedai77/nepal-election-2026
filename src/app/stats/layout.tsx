import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Election Statistics — Nepal Election 2026",
  description:
    "Detailed statistics for Nepal's 2026 election — party breakdown, candidate counts, province comparison, 2022 results analysis across 77 districts and 165 constituencies.",
  openGraph: {
    title: "Election Statistics — Nepal Election 2026",
    description:
      "Explore detailed election stats — party breakdown, candidate counts & province data for Nepal's 2026 general election.",
  },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
