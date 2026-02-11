"use client";

import { useAuth } from "@/contexts/AuthContext";

interface LikeButtonProps {
  district: string;
  zone: number;
  candidateName: string;
  party: string;
  partyShort: string;
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
}

export default function LikeButton({
  likeCount,
  isLiked,
  onLike,
}: LikeButtonProps) {
  const { user, login } = useAuth();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      // Prompt login
      try {
        await login();
      } catch {
        // User cancelled or error
      }
      return;
    }

    onLike();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
        isLiked
          ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40 hover:bg-blue-500/30"
          : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
      }`}
      title={user ? (isLiked ? "Remove your vote" : "Vote for this candidate") : "Login to vote"}
    >
      {/* Thumbs Up Icon */}
      {isLiked ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-1.526 4.994m0 0a5.968 5.968 0 01-.941 3.197M7.5 15l-1.395-.466" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM3 15v7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <span className="tabular-nums">{likeCount > 0 ? likeCount : ""}</span>
    </button>
  );
}
