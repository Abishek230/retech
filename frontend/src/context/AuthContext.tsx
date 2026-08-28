"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "BUYER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  isEmailVerified: boolean;
  sellerProfile?: {
    id: string;
    businessName: string;
    verified: boolean;
    rating: number;
    totalSales: number;
  } | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    businessName?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  loginWithFirebaseGoogle: (email?: string, role?: UserRole, businessName?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginWithFirebaseEmail: (email: string, pass: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  sendOtp: (email: string, purpose?: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (
    email: string,
    otp: string,
    purpose?: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("retech_access_token") : null;
    if (savedToken) {
      setAccessToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchCurrentUser(token: string) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("retech_access_token");
        }
        setAccessToken(null);
        await refreshSession();
      }
    } catch {
      setUser(null);
      setAccessToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("retech_access_token");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshSession(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAccessToken(data.tokens.accessToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("retech_access_token", data.tokens.accessToken);
        }
        return true;
      } else {
        setUser(null);
        setAccessToken(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("retech_access_token");
        }
        return false;
      }
    } catch {
      setUser(null);
      setAccessToken(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      setAccessToken(data.tokens.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("retech_access_token", data.tokens.accessToken);
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    businessName?: string;
  }) {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Registration failed" };
      }

      setUser(resData.user);
      setAccessToken(resData.tokens.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("retech_access_token", resData.tokens.accessToken);
      }
      return { success: true, user: resData.user };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      setAccessToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("retech_access_token");
        localStorage.removeItem("retech_local_cart");
        window.location.href = "/";
      }
    }
  }

  async function sendOtp(email: string, purpose = "LOGIN") {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send OTP" };
    }
  }

  async function verifyOtp(email: string, otp: string, purpose = "LOGIN") {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp, purpose }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      if (data.tokens) {
        setUser(data.user);
        setAccessToken(data.tokens.accessToken);
        if (typeof window !== "undefined") {
          localStorage.setItem("retech_access_token", data.tokens.accessToken);
        }
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to verify OTP" };
    }
  }

  async function loginWithFirebaseGoogle(email?: string, role: UserRole = "BUYER", businessName?: string) {
    try {
      setIsLoading(true);
      const { signInWithGoogleFirebase } = await import("@/lib/firebase");
      const { idToken } = await signInWithGoogleFirebase(email);

      const res = await fetch(`${API_BASE_URL}/auth/firebase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken, email, role, businessName }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Firebase authentication failed." };
      }

      setUser(data.user);
      setAccessToken(data.tokens.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("retech_access_token", data.tokens.accessToken);
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || "Firebase login error" };
    } finally {
      setIsLoading(false);
    }
  }

  async function loginWithFirebaseEmail(email: string, pass: string) {
    try {
      setIsLoading(true);
      const { signInWithEmailFirebase } = await import("@/lib/firebase");
      const idToken = await signInWithEmailFirebase(email, pass);

      const res = await fetch(`${API_BASE_URL}/auth/firebase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Firebase login failed." };
      }

      setUser(data.user);
      setAccessToken(data.tokens.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("retech_access_token", data.tokens.accessToken);
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || "Firebase login error" };
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginWithFirebaseGoogle,
        loginWithFirebaseEmail,
        sendOtp,
        verifyOtp,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

