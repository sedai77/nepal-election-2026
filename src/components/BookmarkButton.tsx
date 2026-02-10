"use client";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export default function BookmarkButton({ isBookmarked, onToggle, size = "md" }: BookmarkButtonProps) {
  const iconSize = size === "sm" ? 16 : 20;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`group relative p-1.5 rounded-lg transition-all ${
        isBookmarked
          ? "text-amber-400 hover:text-amber-300"
          : "text-slate-500 hover:text-amber-400"
      }`}
      title={isBookmarked ? "Remove bookmark" : "Bookmark district"}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark district"}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className="transition-transform group-hover:scale-110 group-active:scale-95"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
      {/* Pulse animation on bookmark */}
      {isBookmarked && (
        <span className="absolute inset-0 rounded-lg bg-amber-400/20 animate-ping pointer-events-none" style={{ animationIterationCount: 1, animationDuration: "0.5s" }} />
      )}
    </button>
  );
}
