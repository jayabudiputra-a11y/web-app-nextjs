import { NewsPost } from "@/types/news";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { ExternalLink, AlertCircle, ArrowUpRight } from "lucide-react";

export function NewsCard({ article }: { article: NewsPost }) {
  // Deteksi apakah teks dibatasi oleh API
  const isContentRestricted =
    article.text &&
    article.text.includes("unavailable in the news API lite");

  // Tentukan teks deskripsi yang akan ditampilkan
  const displayDescription = isContentRestricted
    ? `Berita selengkapnya tersedia di website ${article.site}. Klik tombol di bawah untuk membaca.`
    : article.text;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-gray-200 flex flex-col h-full">
      {/* Bagian Gambar (Thumbnail) */}
      <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
        {article.main_image ? (
          <img
            src={article.main_image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
            <AlertCircle className="w-10 h-10 opacity-20" />
          </div>
        )}

        {/* Badge Utama */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-blue-600 text-white shadow-sm uppercase text-[10px]">
            News
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="font-bold text-blue-600 uppercase tracking-wide truncate max-w-[120px]">
            {article.site || "Unknown"}
          </span>
          <span className="text-gray-300">•</span>
          <span>{formatRelativeTime(article.published)}</span>
        </div>

        {/* 🔥 TAGS NLP */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.slice(0, 3).map((tag, i) => (
              <Badge
                key={i}
                className="bg-gray-100 text-gray-700 border border-gray-300 text-[10px] rounded-md px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Judul Berita */}
        <h3 className="font-bold text-lg leading-snug text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-3">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        {/* Deskripsi */}
        <p
          className={`text-sm mb-4 flex-1 ${
            isContentRestricted
              ? "text-gray-400 italic"
              : "text-gray-600 line-clamp-3"
          }`}
        >
          {displayDescription}
        </p>

        {/* Tombol Action */}
        <div className="pt-4 mt-auto border-t border-gray-100">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            Baca di {article.site} <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
