"use client";

import { useState, useEffect } from "react";

// Nepal Election Day - Thursday, March 5, 2026 (Falgun 21, 2082 BS)
const ELECTION_DATE = new Date("2026-03-05T07:00:00+05:45");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = Math.max(0, ELECTION_DATE.getTime() - now.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-slate-800/80 border border-slate-600/30 rounded-lg px-2.5 py-1.5 min-w-[44px] text-center tabular-nums">
          <span className="text-lg md:text-xl font-bold text-white tracking-wider">{display}</span>
        </div>
        {/* Flip line effect */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-700/40" />
      </div>
      <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-slate-400">Loading...</span>
      </div>
    );
  }

  const isElectionDay = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  if (isElectionDay) {
    return (
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm font-bold text-emerald-400">Election Day!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden sm:flex items-center gap-1.5 mr-1">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Election in</span>
      </div>
      <div className="flex items-center gap-1.5">
        <TimeUnit value={time.days} label="days" />
        <span className="text-slate-500 font-bold text-lg mt-[-14px]">:</span>
        <TimeUnit value={time.hours} label="hrs" />
        <span className="text-slate-500 font-bold text-lg mt-[-14px]">:</span>
        <TimeUnit value={time.minutes} label="min" />
        <span className="text-slate-500 font-bold text-lg mt-[-14px] hidden sm:block">:</span>
        <div className="hidden sm:block">
          <TimeUnit value={time.seconds} label="sec" />
        </div>
      </div>
    </div>
  );
}
