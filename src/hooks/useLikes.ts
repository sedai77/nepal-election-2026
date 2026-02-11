"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface LikeCountEntry {
  count: number;
  party: string;
  partyShort: string;
}

interface UseLikesReturn {
  /** { [zone]: { [candidateName]: { count, party, partyShort } } } */
  likeCounts: Record<number, Record<string, LikeCountEntry>>;
  /** { [zone]: candidateName } — current user's selection per zone */
  userLikes: Record<number, string>;
  isLoading: boolean;
  toggleLike: (
    zone: number,
    candidateName: string,
    party: string,
    partyShort: string
  ) => Promise<void>;
  getLikeCount: (zone: number, candidateName: string) => number;
  isLikedByUser: (zone: number, candidateName: string) => boolean;
  userHasVotedInZone: (zone: number) => boolean;
}

export function useLikes(district: string | null): UseLikesReturn {
  const { user } = useAuth();
  const [likeCounts, setLikeCounts] = useState<Record<number, Record<string, LikeCountEntry>>>({});
  const [userLikes, setUserLikes] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const fetchRef = useRef(0);

  // Fetch likes from server
  const fetchLikes = useCallback(async () => {
    if (!district) return;

    const fetchId = ++fetchRef.current;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (user?.fbId) params.set("userId", user.fbId);

      const res = await fetch(`/api/likes/${encodeURIComponent(district)}?${params}`);
      if (res.ok && fetchId === fetchRef.current) {
        const data = await res.json();
        setLikeCounts(data.counts || {});
        setUserLikes(data.userLikes || {});
      }
    } catch {
      // Silently fail — likes are non-critical
    } finally {
      if (fetchId === fetchRef.current) {
        setIsLoading(false);
      }
    }
  }, [district, user?.fbId]);

  // Fetch likes when district changes
  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  const toggleLike = useCallback(
    async (zone: number, candidateName: string, party: string, partyShort: string) => {
      if (!user || !district) return;

      // Get FB access token from cached login
      const cachedAuth = localStorage.getItem("nepal-election-2026-fb-token");
      if (!cachedAuth) return;

      // Optimistic update
      const wasLiked = userLikes[zone] === candidateName;
      const previousUserLikes = { ...userLikes };
      const previousCounts = JSON.parse(JSON.stringify(likeCounts));

      if (wasLiked) {
        // Remove like
        const newUserLikes = { ...userLikes };
        delete newUserLikes[zone];
        setUserLikes(newUserLikes);

        setLikeCounts((prev) => {
          const updated = { ...prev };
          if (updated[zone]?.[candidateName]) {
            updated[zone] = { ...updated[zone] };
            updated[zone][candidateName] = {
              ...updated[zone][candidateName],
              count: Math.max(0, updated[zone][candidateName].count - 1),
            };
          }
          return updated;
        });
      } else {
        // Add or change like
        const oldCandidate = userLikes[zone];
        setUserLikes({ ...userLikes, [zone]: candidateName });

        setLikeCounts((prev) => {
          const updated = JSON.parse(JSON.stringify(prev));

          // Decrement old if changing
          if (oldCandidate && updated[zone]?.[oldCandidate]) {
            updated[zone][oldCandidate].count = Math.max(0, updated[zone][oldCandidate].count - 1);
          }

          // Increment new
          if (!updated[zone]) updated[zone] = {};
          if (!updated[zone][candidateName]) {
            updated[zone][candidateName] = { count: 0, party, partyShort };
          }
          updated[zone][candidateName].count += 1;

          return updated;
        });
      }

      // Send to server
      try {
        const res = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: cachedAuth,
            district: district.toUpperCase(),
            zone,
            candidateName,
            party,
            partyShort,
          }),
        });

        if (!res.ok) {
          // Revert on error
          setUserLikes(previousUserLikes);
          setLikeCounts(previousCounts);
          console.error("Like API error:", res.status, await res.text());
        }
        // Don't re-fetch — optimistic update is already correct
        // Re-fetching hits CDN cache which returns stale data
      } catch (err) {
        // Revert on error
        setUserLikes(previousUserLikes);
        setLikeCounts(previousCounts);
        console.error("Like network error:", err);
      }
    },
    [user, district, userLikes, likeCounts]
  );

  const getLikeCount = useCallback(
    (zone: number, candidateName: string) => {
      return likeCounts[zone]?.[candidateName]?.count || 0;
    },
    [likeCounts]
  );

  const isLikedByUser = useCallback(
    (zone: number, candidateName: string) => {
      return userLikes[zone] === candidateName;
    },
    [userLikes]
  );

  const userHasVotedInZone = useCallback(
    (zone: number) => {
      return !!userLikes[zone];
    },
    [userLikes]
  );

  return {
    likeCounts,
    userLikes,
    isLoading,
    toggleLike,
    getLikeCount,
    isLikedByUser,
    userHasVotedInZone,
  };
}
