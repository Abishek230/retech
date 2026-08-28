"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminPassportVerificationPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bulkSuccess, setBulkSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/admin/passport`);
      if (res.ok) {
        const json = await res.json();
        setEntries(json.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleVerify = async (entryId: string) => {
    try {
      await fetch(`${API_BASE}/admin/passport/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entryId }),
      });
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId ? { ...e, verified: true, verifiedBy: "Verified Admin" } : e
        )
      );
    } catch {
      // Ignore
    }
  };

  const handleBulkVerify = async () => {
    if (selectedIds.length === 0) return;
    try {
      await fetch(`${API_BASE}/admin/passport/bulk-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryIds: selectedIds }),
      });
      setEntries((prev) =>
        prev.map((e) =>
          selectedIds.includes(e.id) ? { ...e, verified: true, verifiedBy: "Verified Admin" } : e
        )
      );
      setSelectedIds([]);
      setBulkSuccess(true);
      setTimeout(() => setBulkSuccess(false), 3000);
    } catch {
      // Ignore
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const unverified = entries.filter((e) => !e.verified).map((e) => e.id);
    setSelectedIds((prev) => (prev.length === unverified.length ? [] : unverified));
  };

  const unverifiedCount = entries.filter((e) => !e.verified).length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <h1 className="text-2xl font-black text-brown-950 font-display">
            Digital Life Passport Verification
          </h1>
          <p className="text-brown-500">
            Cryptographically certify repair records, DoD 5220.22-M sanitization proofs, and battery diagnostic logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {unverifiedCount > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleBulkVerify}
              disabled={selectedIds.length === 0}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Bulk Certify Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {bulkSuccess && (
        <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Selected passport history entries certified and recorded on cryptographic ledger.</span>
        </div>
      )}

      {/* Verification Queue */}
      <Card className="border-cream-300 bg-white shadow-warm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-burgundy mx-auto" />
            <p className="text-brown-600 mt-2 font-semibold">Loading verification queue...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-cream-200">
              <thead className="bg-cream-50/80 text-[10px] font-bold uppercase text-brown-400">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === entries.filter((e) => !e.verified).length
                      }
                      className="rounded text-burgundy focus:ring-0"
                    />
                  </th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Entry Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Author / Lab</th>
                  <th className="py-3 px-4">Proof Document</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4">
                      {!e.verified ? (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(e.id)}
                          onChange={() => toggleSelect(e.id)}
                          className="rounded text-burgundy focus:ring-0"
                        />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-brown-950 font-display">{e.deviceName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="burgundy" className="text-[9px] py-0 px-1.5 font-mono">
                        {e.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-brown-800 max-w-xs truncate">{e.description}</td>
                    <td className="py-3 px-4 font-mono text-brown-600">{e.performedBy}</td>
                    <td className="py-3 px-4">
                      <a
                        href={e.proofUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-burgundy hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>View Proof</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      {e.verified ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                          Certified ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!e.verified && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleVerify(e.id)}
                        >
                          Certify
                        </Button>
                      )}
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
