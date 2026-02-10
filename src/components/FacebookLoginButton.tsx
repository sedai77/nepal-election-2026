"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function FacebookLoginButton() {
  const { user, isLoading, login, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await login();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse shrink-0" />
    );
  }

  // Logged in state
  if (user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt=""
              className="w-7 h-7 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0)}
            </div>
          )}
          <span className="text-xs text-slate-300 max-w-[80px] truncate hidden sm:block">
            {user.name.split(" ")[0]}
          </span>
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-700/50">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              {user.email && (
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
              )}
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-slate-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Logged out state
  return (
    <div className="relative">
      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        {isLoggingIn ? (
          <span className="hidden sm:inline">Logging in...</span>
        ) : (
          <span className="hidden sm:inline">Login</span>
        )}
      </button>
      {loginError && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-red-900/90 border border-red-700 rounded-lg p-2 z-50">
          <p className="text-xs text-red-200">{loginError}</p>
        </div>
      )}
    </div>
  );
}
