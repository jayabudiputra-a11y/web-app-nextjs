"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchBox } from "./SearchBar";

// =========================
// 🔥 Shared NLP Logic
// =========================

const STOPWORDS = new Set([
  "the","and","or","to","for","from","of","as","at","by","in","on","with",
  "a","an","is","are","was","it","its","this","that","you","your","how",
  "into","up","more","read","name","copycat","warn","sale","said","says"
]);

const normalize = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);


// 🔥 Generate smart category buttons
function generateHeaderTags(rawTags: string[], sidebarTags: string[]) {
  let cleaned = rawTags
    .map(normalize)
    .filter(Boolean)
    .filter(t => !STOPWORDS.has(t))
    .map(t => t.split(" ").slice(0, 2).join(" "))
    .map(t => t.replace(/\b\w/g, c => c.toUpperCase()));

  cleaned = [...new Set(cleaned)];

  const sidebarNormalized = sidebarTags.map(normalize);
  cleaned = cleaned.filter(t => !sidebarNormalized.includes(normalize(t)));

  return shuffle(cleaned).slice(0, 3);
}


// =========================
// 🧠 Component
// =========================

interface HeaderProps {
  tags: string[];
  sidebarTags: string[];
  activeCategory?: string;
}

export function Header({ tags, sidebarTags, activeCategory }: HeaderProps) {
  const [navTags, setNavTags] = useState<string[]>([]);

  useEffect(() => {
    const result = generateHeaderTags(tags, sidebarTags);
    setNavTags(result);
  }, [tags, sidebarTags]);

  return (
    <header className="w-full border-b backdrop-blur-lg bg-white/70 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 gap-4">

        {/* BRAND */}
        <Link href="/" className="font-bold text-xl tracking-tight">
          Vortex<span className="text-blue-500">Finance</span>
        </Link>

        {/* TAG LINKS */}
        <nav className="hidden md:flex gap-5">
          {navTags.map(tag => {
            const isActive = activeCategory === tag;
            return (
              <Link
                key={tag}
                href={`/?kategori=${encodeURIComponent(tag)}`}
                className={`transition font-medium ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "hover:text-blue-600 text-gray-700"
                }`}
              >
                {tag}
              </Link>
            );
          })}
        </nav>

        {/* SEARCH BOX */}
        <div className="w-48 md:w-72">
          <SearchBox />
        </div>

      </div>
    </header>
  );
}
