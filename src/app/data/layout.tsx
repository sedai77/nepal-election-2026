import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Usage & Disclaimer — Nepal Election 2026",
  description:
    "Data accuracy disclaimer for Nepal Election 2026 tracker. Information about data sources, limitations, and why users should verify with official Election Commission of Nepal sources.",
};

export default function DataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
