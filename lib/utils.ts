import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: id,
    });
  } catch {
    return "Baru saja";
  }
}

/* ============================================================
   NLP FUNCTION — Extract Tags From News Title
   Entity extraction + keyword extraction + category mapping
   ============================================================ */

export function extractTagsFromTitle(title: string): string[] {
  if (!title) return [];

  // Stopwords umum (buang kata yang tidak ada makna topik)
  const stopwords = new Set([
    "the","a","an","and","or","but","with","to","of","for",
    "in","on","as","from","by","about","at","is","are","be",
    "was","were","this","that","these","those","will","new",
    "after","before"
  ]);

  // Bersihkan karakter aneh, pisah ke kata-kata
  const rawWords = title
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const words = rawWords.filter(w => w.length > 2);

  // ------------------------------------------------------------
  // 1. ENTITY EXTRACTION (NER sederhana — deteksi kata kapital)
  // Contoh: "Federal Reserve", "Bank of Japan", "Bitcoin"
  // ------------------------------------------------------------
  const entities: string[] = [];
  let buffer: string[] = [];

  words.forEach((w) => {
    if (/^[A-Z][a-zA-Z]+$/.test(w)) {
      buffer.push(w);
    } else {
      if (buffer.length) {
        entities.push(buffer.join(" "));
        buffer = [];
      }
    }
  });
  if (buffer.length) entities.push(buffer.join(" "));

  // ------------------------------------------------------------
  // 2. KEYWORD EXTRACTION (menghapus stopwords)
  // ------------------------------------------------------------
  const keywords = words
    .map((w) => w.toLowerCase())
    .filter((w) => !stopwords.has(w));

  // ------------------------------------------------------------
  // 3. CATEGORY MAPPING → untuk navbar kamu
  // ------------------------------------------------------------
  const categoryMap: Record<string, string[]> = {
    crypto: ["bitcoin", "ethereum", "crypto", "blockchain"],
    saham: ["stock", "stocks", "market", "shares", "nasdaq"],
    ekonomi: ["inflation", "gdp", "recession", "interest", "rate"],
    teknologi: ["ai", "google", "nvidia", "chip", "technology"],
    komoditas: ["oil", "crude", "opec", "energy"],
  };

  const mapped: string[] = [];

  keywords.forEach((kw) => {
    for (const category in categoryMap) {
      if (categoryMap[category].includes(kw)) {
        mapped.push(category);
      }
    }
  });

  // ------------------------------------------------------------
  // Final merge → unik + limit
  // ------------------------------------------------------------
  const finalTags = [...new Set([
    ...entities,          // Entitas seperti "Federal Reserve"
    ...keywords.slice(0,3), // 3 keyword terkuat
    ...mapped            // Kategori navbar
  ])];

  return finalTags;
}
