"use client"; 
import { NewsPost } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export function FeaturedNews({ article }: { article: NewsPost }) {

  // Selalu render struktur tetap, meskipun data belum siap
  const imageSrc =
    article?.main_image ||
    "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1920&auto=format&fit=crop";

  const title = article?.title || "Loading...";
  const text = article?.text || "";
  const site = article?.site || "";
  const published = article?.published;
  const isContentRestricted = text && text.includes("unavailable");

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden mb-8 group shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20 w-full md:max-w-4xl">
        
        {/* TOP STORY BAR */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none px-3 py-1">
            TOP STORY
          </Badge>

          <span className="text-gray-300 text-sm font-medium flex items-center gap-2">
            <span className="text-blue-400 font-bold uppercase">{site}</span>
            {published && <span>•</span>}
            {published && <span>{formatRelativeTime(published)}</span>}
          </span>
        </div>

        {/* 🔥 TAGS NLP */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 4).map((tag, index) => (
              <Badge
                key={index}
                className="bg-white/20 text-white backdrop-blur-sm border border-white/30 text-[10px] px-2 py-0.5 rounded-md"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* TITLE */}
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
          <a
            href={article?.url || "#"}
            target="_blank"
            rel="noreferrer"
            className="hover:underline decoration-blue-500 underline-offset-4"
          >
            {title}
          </a>
        </h1>

        {/* DESCRIPTION */}
        {text ? (
          !isContentRestricted ? (
            <p className="text-gray-200 line-clamp-2 mb-6 text-base md:text-lg max-w-2xl">
              {text}
            </p>
          ) : (
            <div className="mb-6">
              <p className="text-gray-400 italic text-sm mb-2">
                Preview teks tidak tersedia di versi Lite.
              </p>
            </div>
          )
        ) : (
          <p className="text-gray-400 italic mb-6">Loading...</p>
        )}

        {/* BUTTON */}
        <a
          href={article?.url || "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
        >
          Baca Selengkapnya <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
