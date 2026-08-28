"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "../ui/Button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
        <p className="text-sm font-medium text-brown-700">Verifying secure ReTech session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center rounded-2xl border border-red-200 bg-red-50/70 p-8 shadow-warm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-brown-900 font-display">Access Restricted</h2>
          <p className="text-xs text-brown-600 mt-2 mb-6">
            Your account ({user.email}) with role <strong className="text-burgundy">{user.role}</strong> does not have permission to view this section.
          </p>
          <Button variant="primary" size="sm" onClick={() => router.push("/")}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
