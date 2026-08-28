"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  ScrollText,
  ShieldCheck,
  Search,
  Filter,
  UserCheck,
  Package,
  FileCheck,
  Scale,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/admin/audit-log`);
      if (res.ok) {
        const json = await res.json();
        setLogs(json.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Socket.io Real-Time Listener
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 2,
    });

    socket.on("admin:audit_log", (newLog: any) => {
      setLogs((prev) => [newLog, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [SOCKET_URL]);

  const getActionBadge = (action: string) => {
    if (action.includes("VERIFIED")) return <Badge variant="pristine">{action}</Badge>;
    if (action.includes("SUSPENDED") || action.includes("DELETED"))
      return <Badge variant="burgundy">{action}</Badge>;
    return <Badge variant="brown">{action}</Badge>;
  };

  const filtered = logs.filter((l) => {
    const text = `${l.action} ${l.entity} ${l.details} ${l.userId}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Badge variant="pristine">Socket.io Stream Active</Badge>
          </div>
          <h1 className="text-2xl font-black text-brown-950 font-display">
            Immutable Administrative Audit Trail
          </h1>
        </div>

        <span className="text-xs text-brown-500 font-mono">
          {logs.length} Total Audit Records
        </span>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-3.5 rounded-2xl border border-cream-300 shadow-sm flex items-center gap-2">
        <Search className="h-4 w-4 text-brown-400 ml-1" />
        <input
          type="text"
          placeholder="Filter audit logs by actor, action type, entity, or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-brown-900 focus:outline-none"
        />
      </div>

      {/* Log Feed Table */}
      <Card className="border-cream-300 bg-white shadow-warm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-burgundy mx-auto" />
            <p className="text-brown-600 mt-2 font-semibold">Streaming audit logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-cream-200">
              <thead className="bg-cream-50/80 text-[10px] font-bold uppercase text-brown-400">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Affected Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Origin</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 font-mono">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4">{getActionBadge(log.action)}</td>
                    <td className="py-3 px-4 font-bold text-brown-900">{log.userId}</td>
                    <td className="py-3 px-4 text-brown-800">
                      {log.entity} {log.entityId ? `(#${log.entityId})` : ""}
                    </td>
                    <td className="py-3 px-4 font-sans text-brown-700 max-w-sm truncate">
                      {log.details || "—"}
                    </td>
                    <td className="py-3 px-4 text-brown-500 text-[11px]">{log.ipAddress || "127.0.0.1"}</td>
                    <td className="py-3 px-4 text-right text-brown-500 text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
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
