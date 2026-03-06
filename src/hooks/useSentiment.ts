"use client";

import { useState, useEffect, useRef } from "react";

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

export interface CandidateVoteData {
  name: string;
  votes: number;
  party: string;
  partyShort: string;
  color: string;
  isWinner: boolean;
}

export interface ConstituencyVoteData {
  constituency: string;
  district: string;
  zone: number;
  status: string;
  totalVoters: number;
  votesCast: number;
  lastUpdated: string;
  candidates: CandidateVoteData[];
}

interface SentimentData {
  sentiment: Record<string, DistrictSentiment>;
  topCandidates: TopCandidate[];
  totalLikes: number;
  constituencies: ConstituencyVoteData[];
  lastUpdated: number;
  isLoading: boolean;
  // Track which constituencies changed for animations
  changedConstituencies: Set<string>;
  // Timestamps of when each constituency last received new votes
  recentlyUpdated: Record<string, number>;
}

export function useSentiment(): SentimentData {
  const [sentiment, setSentiment] = useState<Record<string, DistrictSentiment>>({});
  const [topCandidates, setTopCandidates] = useState<TopCandidate[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [constituencies, setConstituencies] = useState<ConstituencyVoteData[]>([]);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [changedConstituencies, setChangedConstituencies] = useState<Set<string>>(new Set());
  const [recentlyUpdated, setRecentlyUpdated] = useState<Record<string, number>>({});
  const prevVotesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const res = await fetch("/api/election-results");
        if (res.ok) {
          const data = await res.json();
          const newConstituencies: ConstituencyVoteData[] = data.constituencies || [];

          // Detect which constituencies had vote changes
          const changed = new Set<string>();
          const newVotes: Record<string, number> = {};
          for (const c of newConstituencies) {
            const key = c.constituency;
            const totalVotes = c.candidates.reduce((sum: number, cand: CandidateVoteData) => sum + cand.votes, 0);
            newVotes[key] = totalVotes;
            if (prevVotesRef.current[key] !== undefined && prevVotesRef.current[key] !== totalVotes) {
              changed.add(key);
            }
          }
          prevVotesRef.current = newVotes;
          setChangedConstituencies(changed);

          // Record timestamps for recently changed constituencies
          if (changed.size > 0) {
            const now = Date.now();
            setRecentlyUpdated((prev) => {
              const next = { ...prev };
              for (const key of changed) {
                next[key] = now;
              }
              return next;
            });
            setTimeout(() => setChangedConstituencies(new Set()), 2000);
          }

          setSentiment(data.sentiment || {});
          setTopCandidates(data.topCandidates || []);
          setTotalLikes(data.totalVotes || 0);
          setConstituencies(newConstituencies);
          setLastUpdated(data.lastUpdated || 0);
        }
      } catch {
        // Non-critical, silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchElectionData();

    // Poll every 60 seconds
    const interval = setInterval(fetchElectionData, 60000);
    return () => clearInterval(interval);
  }, []);

  return { sentiment, topCandidates, totalLikes, constituencies, lastUpdated, isLoading, changedConstituencies, recentlyUpdated };
}
