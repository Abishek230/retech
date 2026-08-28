"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  AlertTriangle,
  Eye,
  Trash2,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/admin/listings`);
      if (res.ok) {
        const json = await res.json();
        setListings(json.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleUpdateStatus = async (listingId: string, newStatus: string) => {
    try {
      await fetch(`${API_BASE}/admin/listings/${listingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: newStatus } : l))
      );
    } catch {
      // Ignore
    }
  };

  const filtered = listings.filter((l) => {
    const matchesQuery =
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.sellerName.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <h1 className="text-2xl font-black text-brown-950 font-display">Hardware Inventory Moderation</h1>
          <p className="text-brown-500">
            Audit seller catalog listings, flag non-compliant cosmetic grades, and pause suspicious SKUs.
          </p>
        </div>

        <Badge variant="pristine">{listings.length} Catalog Items</Badge>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-cream-300 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-brown-400" />
          <input
            type="text"
            placeholder="Search by device title or seller..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-cream-300 bg-cream-50 pl-10 pr-4 py-2 text-xs text-brown-900 focus:border-burgundy focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "ACTIVE", "DRAFT", "SOLD"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                statusFilter === st
                  ? "bg-burgundy text-white"
                  : "bg-cream-100 text-brown-700 hover:bg-cream-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <Card className="border-cream-300 bg-white shadow-warm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-burgundy mx-auto" />
            <p className="text-brown-600 mt-2 font-semibold">Loading listings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-cream-200">
              <thead className="bg-cream-50/80 text-[10px] font-bold uppercase text-brown-400">
                <tr>
                  <th className="py-3 px-4">Device Listing</th>
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">SLS Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <strong className="text-brown-950 font-display block">{l.title}</strong>
                      <span className="text-[10px] text-brown-500 font-mono">
                        {l.condition} Grade • {l.createdAt}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-brown-800">{l.sellerName}</td>
                    <td className="py-3 px-4 font-mono font-black text-burgundy">
                      {formatPrice(l.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono font-bold text-emerald-800 text-[10px]">
                        {l.secondLifeScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={l.status === "ACTIVE" ? "pristine" : "brown"}>
                        {l.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link href={`/listings/${l.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>

                      {l.status === "ACTIVE" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(l.id, "DRAFT")}
                          className="text-amber-700 border-amber-200"
                        >
                          Pause
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(l.id, "ACTIVE")}
                          className="text-emerald-700 border-emerald-200"
                        >
                          Activate
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-700 border-red-200"
                        onClick={() => handleUpdateStatus(l.id, "CANCELLED")}
                      >
                        Remove
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
