import axios from 'axios';
import { NewsResponse, ApifyNewsPost, NewsPost } from '@/types/news';
import { extractTagsFromTitle } from "@/lib/utils";

// 🔥 Token tidak boleh hardcoded → ambil dari environment
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;
const DATASET_ID = process.env.NEXT_PUBLIC_DATASET_ID || 'LC4UsaRvbR7Y3MbLT';

const BASE_URL = `https://api.apify.com/v2/datasets/${DATASET_ID}/items`;

/**
 * Normalisasi data Apify → NewsPost
 */
const transformApifyToNewsPost = (apifyPost: ApifyNewsPost): NewsPost => {
  let mainImage = apifyPost.thumbnail;

  if (mainImage && mainImage.startsWith('/9j/')) {
    mainImage = `data:image/jpeg;base64,${mainImage}`;
  }

  return {
    uuid: apifyPost.link,
    title: apifyPost.title || "Tanpa Judul",
    url: apifyPost.link,
    site: apifyPost.source || "Unknown Source",
    published: apifyPost.date_utc || apifyPost.date || "",
    text: apifyPost.snippet || "",
    main_image: mainImage || "",
    tags: extractTagsFromTitle(apifyPost.title || ""),
    description: apifyPost.snippet || undefined
  };
};

/**
 * Fetch data berita dari Apify
 */
export async function fetchNewsExternal(query: string) {
  try {
    const res = await axios.get<ApifyNewsPost[]>(BASE_URL, {
      params: {
        token: API_TOKEN,
        clean: true,
        format: "json",
      },
    });

    const posts = res.data
      .map(transformApifyToNewsPost)
      .filter(p => p.title && p.url);

    return {
      posts,
      totalResults: posts.length,
      moreResultsAvailable: false,
      next: null
    } as NewsResponse;

  } catch (err) {
    console.error("Apify Fetch Error →", err);

    return {
      posts: [],
      totalResults: 0,
      moreResultsAvailable: false,
      next: null
    } as NewsResponse;
  }
}
