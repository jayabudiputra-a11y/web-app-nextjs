// components/layout/Sidebar.tsx
"use client";

import { SITE_CONFIG } from "@/config/site";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Coffee, TrendingUp, Mail, Wallet, Tag } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  tags?: string[];
  activeCategory?: string;
}

export function Sidebar({ tags = [], activeCategory = "" }: SidebarProps) {

  // ================================================
  // 🔥 NLP SYSTEM (Merged from tagUtils.ts)
  // ================================================

  const STOPWORDS = new Set([
    "the","and","or","but","to","into","of","in","on","back","behind","with",
    "how","you","your","put","puts","tiptoes","back","into","him","her",
    "for","from","is","was","are","be","this","that","a","an","as","at",
    "his","their","them","it","its","name","sons","copycat","warn","sale"
  ]);

  function normalize(raw: unknown[]): { name: string; freq: number }[] {
    if (!Array.isArray(raw)) return [];

    const freqMap = new Map<string, number>();

    for (const item of raw) {
      if (typeof item !== "string") continue;

      const words = item
        .replace(/[.,!?]/g, "")
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()));

      // Max 2 kata
      const normalized = words.slice(0, 3).join(" ");

      if (!normalized || normalized.length < 7) continue;

      freqMap.set(normalized, (freqMap.get(normalized) ?? 0) + 1);
    }

    return [...freqMap.entries()]
      .map(([name, freq]) => ({ name, freq }))
      .sort((a, b) => b.freq - a.freq);
  }

  // Hasil NLP
  const processedTags = normalize(tags).slice(0, 45); // batas max 45 tag di sidebar

  return (
    <div className="space-y-6">

      {/* Profil Developer */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <CardHeader className="pb-2 relative z-10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Coffee className="w-5 h-5" /> Dukung Creator
          </h3>
          <p className="text-xs text-blue-100 opacity-90">
            Website ini dikembangkan oleh <b>{SITE_CONFIG.author.name}</b>
          </p>
        </CardHeader>

        <CardContent className="space-y-3 relative z-10">
          <Button
            asChild
            className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-md border-none justify-start gap-2 h-12"
          >
            <a href={SITE_CONFIG.links.danaApp} target="_blank">
              <Wallet className="w-5 h-5 text-blue-700" />
              <span>Donate via DANA</span>
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full justify-start gap-2 bg-blue-700/50 border-blue-400/30 text-white hover:bg-blue-600/50"
          >
            <a href={SITE_CONFIG.links.emailWeb} target="_blank">
              <Mail className="w-4 h-4" />
              <span>Email (Outlook Web)</span>
            </a>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-2 text-blue-100 hover:bg-blue-700/30 hover:text-white"
          >
            <a href={SITE_CONFIG.links.linktree} target="_blank">
              <ExternalLink className="w-4 h-4" />
              <span>Linktree & Kontak</span>
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Market Summary */}
      <Card>
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" /> Market Movers
          </h3>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-4">
            <li className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div>
                <span className="font-medium text-sm block">Google (GOOGL)</span>
                <span className="text-xs text-gray-500">Tech Sector</span>
              </div>
              <span className="text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded">
                -1.2%
              </span>
            </li>
            <li className="flex justify-between items-center border-b border-gray-100 pb-2">
              <div>
                <span className="font-medium text-sm block">NVIDIA (NVDA)</span>
                <span className="text-xs text-gray-500">AI & Chips</span>
              </div>
              <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
                +2.4%
              </span>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <span className="font-medium text-sm block">Bitcoin (BTC)</span>
                <span className="text-xs text-gray-500">Crypto</span>
              </div>
              <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
                +0.8%
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 🔥 Tag Cloud */}
      <Card>
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" /> Tag Cloud
          </h3>
        </CardHeader>

        <CardContent className="pt-4">
          {processedTags.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Tag belum tersedia…</p>
          ) : (
            <div className="flex flex-wrap gap-3 select-none">
              {processedTags.map(({ name, freq }) => {

                const size = Math.min(14 + freq * 1.8, 34);
                const hue = (name.charCodeAt(0) * 60) % 360;

                const isActive = activeCategory === name;

                return (
                  <Link
                    key={name}
                    href={`/?kategori=${encodeURIComponent(name)}`}
                    className={`rounded-md px-3 py-1 transition-all inline-block ${
                      isActive
                        ? "bg-blue-200 text-blue-900 font-bold scale-110 shadow-sm"
                        : "hover:scale-110 hover:bg-blue-50"
                    }`}
                    style={{
                      fontSize: `${size}px`,
                      color: isActive ? undefined : `hsl(${hue}, 60%, 30%)`,
                    }}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
