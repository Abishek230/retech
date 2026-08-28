"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  UserX,
  UserCheck,
  Trash2,
  MoreVertical,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/admin/users`);
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (userId: string, newRole: string) => {
    try {
      await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      // Ignore
    }
  };

  const handleSuspend = async (userId: string, currentStatus: string) => {
    const shouldSuspend = currentStatus === "ACTIVE";
    try {
      await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: shouldSuspend }),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: shouldSuspend ? "SUSPENDED" : "ACTIVE" } : u
        )
      );
    } catch {
      // Ignore
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await fetch(`${API_BASE}/admin/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // Ignore
    }
  };

  const filtered = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <h1 className="text-2xl font-black text-brown-950 font-display">User Directory & Roles</h1>
          <p className="text-brown-500">
            Manage authenticated platform accounts, verified refurbishers, and RBAC permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="pristine">{users.length} Registered Accounts</Badge>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-cream-300 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-brown-400" />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-cream-50 pl-10 pr-4 py-2 text-xs text-brown-900 focus:border-burgundy focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "BUYER", "SELLER", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                roleFilter === r
                  ? "bg-burgundy text-white"
                  : "bg-cream-100 text-brown-700 hover:bg-cream-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-cream-300 bg-white shadow-warm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-burgundy mx-auto" />
            <p className="text-brown-600 mt-2 font-semibold">Loading user directory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-cream-200">
              <thead className="bg-cream-50/80 text-[10px] font-bold uppercase text-brown-400">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <strong className="text-brown-950 block font-display">{u.name}</strong>
                      <span className="text-[11px] text-brown-500 font-mono">{u.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          u.role === "ADMIN"
                            ? "burgundy"
                            : u.role === "SELLER"
                            ? "brown"
                            : "cream"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold font-mono text-[10px] ${
                          u.status === "ACTIVE" ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        ● {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-brown-500">{u.joinedDate}</td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {u.role !== "ADMIN" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePromote(u.id, u.role === "SELLER" ? "BUYER" : "SELLER")
                          }
                        >
                          {u.role === "SELLER" ? "Demote Buyer" : "Promote Seller"}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspend(u.id, u.status)}
                      >
                        {u.status === "ACTIVE" ? "Suspend" : "Restore"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-700 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
