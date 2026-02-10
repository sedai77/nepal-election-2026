"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nepal-election-2026-bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      } catch {
        // ignore
      }
    }
  }, [bookmarks, loaded]);

  const toggle = useCallback((district: string) => {
    setBookmarks((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  }, []);

  const isBookmarked = useCallback(
    (district: string) => bookmarks.includes(district),
    [bookmarks]
  );

  return { bookmarks, toggle, isBookmarked, loaded };
}
