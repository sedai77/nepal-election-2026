"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const AUTH_STORAGE_KEY = "nepal-election-2026-auth";

export interface FacebookUser {
  fbId: string;
  name: string;
  email: string;
  photoUrl: string;
}

interface AuthContextType {
  user: FacebookUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FacebookUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore cached user on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setUser(parsed);
      }
    } catch {
      // Invalid cache, ignore
    }
    setIsLoading(false);
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      const FB = window.FB;
      if (!FB) {
        reject(new Error("Facebook SDK not loaded yet. Please try again."));
        return;
      }

      FB.login(
        (response) => {
          if (response.status === "connected" && response.authResponse) {
            // Use .then()/.catch() instead of async callback (FB SDK rejects async functions)
            fetch("/api/auth/facebook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: response.authResponse.accessToken,
              }),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Server verification failed");
                return res.json();
              })
              .then((userData: FacebookUser) => {
                setUser(userData);
                localStorage.setItem("nepal-election-2026-fb-token", response.authResponse!.accessToken);
                resolve();
              })
              .catch((err) => reject(err));
          } else {
            reject(new Error("Facebook login cancelled"));
          }
        },
        { scope: "public_profile,email" }
      );
    });
  }, []);

  const logout = useCallback(() => {
    const FB = window.FB;
    if (FB) {
      FB.logout(() => {});
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("nepal-election-2026-fb-token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
