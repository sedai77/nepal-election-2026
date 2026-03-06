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
  // Whether a fetch is currently in progress
  isFetching: boolean;
  // Increments on every successful fetch (drives animations)
  fetchCount: number;
  // Seconds until next automatic refresh
  secondsUntilRefresh: number;
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
  const [isFetching, setIsFetching] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(60);
  const prevVotesRef = useRef<Record<string, number>>({});
  const lastFetchTimeRef = useRef<number>(Date.now());
  const changedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // How long to keep "recently updated" entries (5 minutes)
  const RECENT_WINDOW_MS = 5 * 60 * 1000;

  useEffect(() => {
    const fetchElectionData = async () => {
      setIsFetching(true);
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

          // Record timestamps for recently changed constituencies & prune stale entries
          const now = Date.now();
          setRecentlyUpdated((prev) => {
            const next: Record<string, number> = {};
            // Keep only entries within the recent window
            for (const [key, ts] of Object.entries(prev)) {
              if (now - ts < RECENT_WINDOW_MS) {
                next[key] = ts;
              }
            }
            // Add newly changed entries
            for (const key of changed) {
              next[key] = now;
            }
            return next;
          });

          // Clear the changed set after animation completes
          if (changed.size > 0) {
            // Clear any pending timeout to avoid orphaned timers
            if (changedTimeoutRef.current) {
              clearTimeout(changedTimeoutRef.current);
            }
            changedTimeoutRef.current = setTimeout(() => {
              setChangedConstituencies(new Set());
              changedTimeoutRef.current = null;
            }, 2000);
          }

          setSentiment(data.sentiment || {});
          setTopCandidates(data.topCandidates || []);
          setTotalLikes(data.totalVotes || 0);
          setConstituencies(newConstituencies);
          setLastUpdated(data.lastUpdated || 0);
          setFetchCount((c) => c + 1);
          lastFetchTimeRef.current = Date.now();
          setSecondsUntilRefresh(15);
        }
      } catch {
        // Non-critical, silently fail
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchElectionData();

    // Poll every 15 seconds
    const interval = setInterval(fetchElectionData, 15000);

    // Countdown timer — ticks every second
    const countdown = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastFetchTimeRef.current) / 1000);
      setSecondsUntilRefresh(Math.max(0, 15 - elapsed));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
      if (changedTimeoutRef.current) {
        clearTimeout(changedTimeoutRef.current);
      }
    };
  }, []);

  return { sentiment, topCandidates, totalLikes, constituencies, lastUpdated, isLoading, changedConstituencies, recentlyUpdated, isFetching, fetchCount, secondsUntilRefresh };
}
