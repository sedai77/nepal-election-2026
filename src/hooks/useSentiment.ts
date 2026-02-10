"use client";

import { useState, useEffect } from "react";

export interface DistrictSentiment {
  party: string;
  partyShort: string;
  color: string;
  totalLikes: number;
}

export interface TopCandidate {
  district: string;
  zone: number;
  candidate_name: string;
  party: string;
  party_short: string;
  count: number;
}

interface SentimentData {
  sentiment: Record<string, DistrictSentiment>;
  topCandidates: TopCandidate[];
  totalLikes: number;
  isLoading: boolean;
}

export function useSentiment(): SentimentData {
  const [sentiment, setSentiment] = useState<Record<string, DistrictSentiment>>({});
  const [topCandidates, setTopCandidates] = useState<TopCandidate[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await fetch("/api/likes/top");
        if (res.ok) {
          const data = await res.json();
          setSentiment(data.sentiment || {});
          setTopCandidates(data.topCandidates || []);
          setTotalLikes(data.totalLikes || 0);
        }
      } catch {
        // Non-critical, silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentiment();

    // Poll every 60 seconds
    const interval = setInterval(fetchSentiment, 60000);
    return () => clearInterval(interval);
  }, []);

  return { sentiment, topCandidates, totalLikes, isLoading };
}
