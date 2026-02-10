"use client";

import { useRef, useState } from "react";
import { DistrictData, PROVINCE_NAMES, PROVINCE_COLORS, PARTY_COLORS } from "@/data/electionData";

interface ShareCardProps {
  district: DistrictData;
}

function titleCase(str: string): string {
  return str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function ShareCard({ district }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const provinceName = PROVINCE_NAMES[district.province];
  const provinceColor = PROVINCE_COLORS[district.province];
  const totalCandidates = district.zones.reduce((a, z) => a + z.candidates.length, 0);

  // Get top parties
  const partyCounts: Record<string, number> = {};
  district.zones.forEach((z) => z.candidates.forEach((c) => {
    partyCounts[c.party] = (partyCounts[c.party] || 0) + 1;
  }));
  const topParties = Object.entries(partyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/?district=${encodeURIComponent(district.district)}`
    : "";

  const shareText = `Check out ${titleCase(district.district)} district - ${district.zones.length} election zones, ${totalCandidates} candidates for Nepal Election 2026! 🇳🇵`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      setSharing(true);
      try {
        await navigator.share({ title: `${titleCase(district.district)} - Nepal Election 2026`, text: shareText, url: shareUrl });
      } catch {
        // User cancelled
      }
      setSharing(false);
    }
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank", "width=600,height=400");
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=400");
  };

  return (
    <div className="space-y-3">
      {/* Preview Card */}
      <div
        ref={cardRef}
        className="rounded-2xl overflow-hidden border border-slate-700/50"
        style={{ background: `linear-gradient(135deg, ${provinceColor}15, ${provinceColor}05, #0f172a)` }}
      >
        {/* Card Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: provinceColor }} />
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{provinceName}</span>
          </div>
          <h3 className="text-xl font-bold text-white">{titleCase(district.district)}</h3>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 border-t border-b border-slate-700/30">
          <div className="p-3 text-center border-r border-slate-700/30">
            <p className="text-lg font-bold text-white">{district.zones.length}</p>
            <p className="text-[10px] text-slate-400">Zones</p>
          </div>
          <div className="p-3 text-center border-r border-slate-700/30">
            <p className="text-lg font-bold text-white">{totalCandidates}</p>
            <p className="text-[10px] text-slate-400">Candidates</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-lg font-bold text-white">{titleCase(district.hq)}</p>
            <p className="text-[10px] text-slate-400">HQ</p>
          </div>
        </div>

        {/* Top Parties */}
        <div className="p-4 pt-3">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Top Parties</p>
          <div className="flex flex-wrap gap-1.5">
            {topParties.map(([party, count]) => (
              <span
                key={party}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] text-white font-medium"
                style={{ backgroundColor: (PARTY_COLORS[party] || "#6b7280") + "55" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PARTY_COLORS[party] || "#6b7280" }} />
                {party} ({count})
              </span>
            ))}
          </div>
        </div>

        {/* Branding */}
        <div className="px-4 py-2 bg-slate-900/50 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">Nepal Election 2026</span>
          <span className="text-[10px] text-slate-500">🇳🇵 nepalelection2026.com</span>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-2">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
            copied
              ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
              Copy Link
            </>
          )}
        </button>

        {/* Facebook */}
        <button
          onClick={handleShareFacebook}
          className="px-3 py-2.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
          title="Share on Facebook"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleShareTwitter}
          className="px-3 py-2.5 rounded-xl bg-slate-700/50 text-white hover:bg-slate-700 transition-colors"
          title="Share on X"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        </button>

        {/* Native Share (mobile) */}
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={handleNativeShare}
            disabled={sharing}
            className="px-3 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
            title="Share"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}
