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
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
        isLiked
          ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40 hover:bg-blue-500/30"
          : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
      }`}
      title={user ? (isLiked ? "Remove your vote" : "Vote for this candidate") : "Login to vote"}
    >
      {isLiked ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a1.5 1.5 0 00-1.581 1.585c.076 2.898.795 5.66 2.04 8.123a1.5 1.5 0 002.699-.041c.19-.38.294-.812.294-1.268v-6.97a1.5 1.5 0 00-1.137-1.456l-2.315-.579z" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-1.526 4.994m-8.4-7.244a8.963 8.963 0 00-1.526 4.994m0 0a5.975 5.975 0 01-.941 3.197M2.223 20.247a5.975 5.975 0 009.554-4.872m0 0v-.027m0 .027h-3.5m3.5 0v-.027m0 .027a5.975 5.975 0 003.5 1.023" />
          <path d="M6.75 12.75l-1.5-.5a1.5 1.5 0 00-1.937.975l-.813 2.44a1.5 1.5 0 00.975 1.936l.813-.271" />
          <path d="M7.5 15h2.25m8.024-9.75A8.96 8.96 0 0118 9.375c0 1.744-.497 3.37-1.357 4.746M7.5 15l-1.395-.466" />
        </svg>
      )}
      <span className="tabular-nums">{likeCount > 0 ? likeCount : ""}</span>
    </button>
  );
}
