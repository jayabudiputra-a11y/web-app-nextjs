"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) return;

    // 🔥 FIX PARAMETER SEARCH
    const params = new URLSearchParams();

    params.set("q", value);
    params.set("sort", "relevance"); // <--- Tambahan
    params.set("filter", "strict");  // <--- Supaya query lebih fokus pada keyword

    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        className="w-full p-4 text-xl border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Cari berita..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
