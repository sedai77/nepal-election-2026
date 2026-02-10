import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Nepal Election 2026",
  description:
    "Privacy policy for Nepal Election 2026 tracker. Learn how we collect, use, and protect your data including Facebook login information and voting preferences.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
