import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Nepal Election 2026",
  description:
    "Terms of service for Nepal Election 2026 tracker. Understand the conditions for using this website, data accuracy disclaimers, and limitation of liability.",
};

export default function TosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
