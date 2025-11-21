// app/page.tsx
import { fetchNewsExternal } from "@/lib/api";
import NewsList from "@/components/news/NewsList";
import { Sidebar } from "@/components/layout/Sidebar";
import { FeaturedNews } from "@/components/news/FeaturedNews";
import { Header } from "@/components/layout/Header";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ==================== NLP UTILS ====================

const STOPWORDS = new Set([
  "the", "and", "or", "to", "for", "from", "of", "as", "at", "by", "in", "on",
  "with", "a", "an", "is", "are", "was", "it", "its", "this", "that", "you",
  "your", "how", "into", "up", "more", "read", "name", "copycat", "warn",
  "sale", "said", "says"
]);

const normalize = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);


// ==================== SCORING ====================

function relevanceScore(post: any, query: string) {
  const q = normalize(query);
  if (!q) return 0;

  const tagsJoined = Array.isArray(post.tags) ? post.tags.join(" ") : "";
  const content = `${post.title} ${post.description} ${tagsJoined}`.toLowerCase();

  let score = 0;

  if (post.title?.toLowerCase().includes(q)) score += 15;
  if (tagsJoined.toLowerCase().includes(q)) score += 10;
  if (post.description?.toLowerCase().includes(q)) score += 5;

  const matchCount = content.split(" ").filter(w => q.includes(w)).length;
  score += matchCount * 2;

  return score;
}



// ==================== TAG SYSTEM ====================

function buildHeaderTags(allTags: string[], sidebarTags: string[]) {
  const cleaned = [
    ...new Set(
      allTags
        .map(normalize)
        .filter(Boolean)
        .filter(tag => !STOPWORDS.has(tag))
        .map(tag => tag.split(" ").slice(0, 2).join(" "))
        .map(tag => tag.replace(/\b\w/g, (c) => c.toUpperCase()))
    )
  ];

  return shuffle(cleaned.filter(tag => !sidebarTags.includes(tag))).slice(0, 3);
}



// ==================== PAGE ====================

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;

  const userQuery = searchParams.q?.trim();
  const filterTag = searchParams.kategori || undefined;

  const query =
    userQuery || `Google topic:"financial and economic news"`;

  const newsResponse = await fetchNewsExternal(query);

  // Pastikan type sesuai NewsResponse
  const allTags: string[] = newsResponse.posts.flatMap(
    post => Array.isArray(post.tags) ? post.tags : []
  );

  const headerTags = buildHeaderTags(allTags, allTags.slice(0, 45));

  let filteredPosts = [...newsResponse.posts];

  // ================= SEARCH =================
  if (userQuery) {
    filteredPosts = filteredPosts
      .map(post => ({ ...post, score: relevanceScore(post, userQuery) }))
      .filter(post => post.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  // ================= CATEGORY FILTER =================
  if (filterTag) {
    const keyword = filterTag.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title?.toLowerCase().includes(keyword) ||
      post.description?.toLowerCase().includes(keyword) ||
      (Array.isArray(post.tags) ? post.tags : []).some(tag =>
        tag.toLowerCase().includes(keyword)
      )
    );
  }

  const hasResults = filteredPosts.length > 0;

  const featuredPost = hasResults ? filteredPosts[0] : null;
  const remainingPosts = hasResults ? filteredPosts.slice(1) : [];


  return (
    <>
      <Header tags={headerTags} sidebarTags={allTags.slice(0, 45)} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* MAIN FEED */}
          <div className="lg:col-span-8">

            {!hasResults && (
              <div className="text-center py-10 mb-8 bg-red-50 border border-red-300 rounded-xl text-red-800">
                <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
                <h3 className="text-xl font-bold mb-3">
                  Tidak Ada Hasil Ditemukan
                </h3>

                {userQuery && (
                  <p className="text-sm mb-4">
                    Tidak ada berita terkait: <strong>"{userQuery}"</strong>
                  </p>
                )}

                <Button asChild variant="outline">
                  <Link href="/">Reset Pencarian</Link>
                </Button>
              </div>
            )}

            {hasResults && (
              <>
                {featuredPost && <FeaturedNews article={featuredPost} />}

                <h2 className="text-2xl font-bold mt-6 mb-4">
                  {userQuery
                    ? `Hasil pencarian: "${userQuery}"`
                    : filterTag
                    ? `Kategori: ${filterTag}`
                    : "Berita Terbaru"}
                </h2>

                <NewsList
                  initialData={{
                    ...newsResponse,
                    posts: remainingPosts,
                  }}
                  filterTag={filterTag}
                />
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <Sidebar tags={allTags} activeCategory={filterTag} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
