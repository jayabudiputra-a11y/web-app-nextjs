'use client';

import { useState, useMemo } from 'react';
import { NewsPost } from '@/types/news';
import { NewsCard } from './NewsCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface NewsListProps {
  initialData?: any;
  filterTag?: string;   // ← Tambahan OPSIONAL, tapi tidak wajib
}

export default function NewsList({ initialData, filterTag }: NewsListProps) {
  // 1. Pastikan data awal tidak ada duplikat
  const uniqueInitialPosts =
    initialData?.posts?.filter(
      (post: NewsPost, index: number, self: NewsPost[]) =>
        index === self.findIndex((p) => p.uuid === post.uuid)
    ) || [];

  const [posts, setPosts] = useState<NewsPost[]>(uniqueInitialPosts);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(
    initialData?.next
  );

  // 🔥 2. FILTER TAG (opsional, otomatis)
  const filteredPosts = useMemo(() => {
    if (!filterTag) return posts;
    return posts.filter((post) =>
      post.tags?.map((t) => t.toLowerCase()).includes(filterTag.toLowerCase())
    );
  }, [posts, filterTag]);

  // 3. Load More
  const loadMore = async () => {
    if (!nextCursor) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/news?ts=${nextCursor}`);
      const data = await res.json();

      if (data.posts) {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.uuid));
          const newUniquePosts = data.posts.filter(
            (p: NewsPost) => !existingIds.has(p.uuid)
          );

          return [...prev, ...newUniquePosts];
        });

        setNextCursor(data.next);
      }
    } catch (error) {
      console.error('Failed to load more', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post, index) => (
          <NewsCard key={`${post.uuid}-${index}`} article={post} />
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      <div className="flex justify-center pt-4 pb-8">
        <Button
          onClick={loadMore}
          disabled={loading || !nextCursor}
          size="lg"
          variant="outline"
          className="w-full md:w-auto min-w-[200px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memuat...
            </>
          ) : (
            'Muat Lebih Banyak Berita'
          )}
        </Button>
      </div>
    </div>
  );
}
