import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "../services/api";

export interface MobileUser {
  id: string;
  name: string;
  email: string;
  role: "BUYER" | "SELLER" | "ADMIN";
  avatar?: string;
  sellerProfile?: any;
}

interface AuthContextType {
  user: MobileUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MobileUser | null>({
    id: "demo_buyer_user_1",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    role: "BUYER",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.data?.user) {
        setUser(res.data.user);
      }
    } catch {
      // Fallback demo user
      setUser({
        id: "demo_buyer_user_1",
        name: "Alex Rivera",
        email,
        role: "BUYER",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
