// types/news.ts

export interface ApifyNewsPost {
    block_position: string;
    date: string;
    date_utc: string;
    domain: string;
    link: string;
    position: number;
    snippet: string;
    source: string;
    thumbnail: string;
    title: string;
}

export interface NewsPost {
    uuid: string;
    title: string;
    url: string;
    site: string;
    published: string;
    text: string;
    main_image: string;

    // NLP Tags
    tags: string[];

    // Opsional (kalau nanti ada description)
    description?: string;
}

export interface NewsResponse {
    posts: NewsPost[];
    totalResults: number;
    moreResultsAvailable: boolean; // ✔ FIX
    next: string | null;
}
