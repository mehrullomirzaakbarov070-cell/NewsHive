import { createHash } from 'crypto';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export const CATEGORY_OPTIONS = [
  { slug: 'barchasi', label: 'Barchasi', category: 'general' },
  { slug: 'biznes', label: 'Biznes', category: 'business' },
  { slug: 'texnologiya', label: 'Texnologiya', category: 'technology' },
  { slug: 'sport', label: 'Sport', category: 'sports' },
  { slug: 'sogliq', label: 'Sog\'liq', category: 'health' },
  { slug: 'fan', label: 'Fan', category: 'science' },
  { slug: 'kongilochar', label: 'Ko\'ngilochar', category: 'entertainment' },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(
  CATEGORY_OPTIONS.map((item) => [item.slug, item.category])
);

export const CATEGORY_BY_CATEGORY = Object.fromEntries(
  CATEGORY_OPTIONS.map((item) => [item.category, item])
);

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/^-|-$/g, '') || 'yangilik';
}

export function getCategoryLabel(slug) {
  return CATEGORY_OPTIONS.find((item) => item.slug === slug)?.label || 'Barchasi';
}

export function makeArticleSlug(article) {
  const title = sanitizeText(article?.title || 'yangilik');
  const hashSource = article?.url || article?.title || Date.now().toString();
  const shortHash = createHash('sha1').update(hashSource).digest('hex').slice(0, 8);
  return `${slugify(title)}-${shortHash}`;
}

export function sanitizeText(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeArticle(rawArticle) {
  if (!rawArticle || !rawArticle.title) return null;

  const title = sanitizeText(rawArticle.title);
  const description = sanitizeText(rawArticle.description || rawArticle.content || '');
  const content = sanitizeText(rawArticle.content || '').slice(0, 320);
  const url = rawArticle.url || '#';
  const image = rawArticle.urlToImage || '/default-article.svg';

  return {
    title,
    description,
    content,
    url,
    image,
    source: rawArticle.source?.name || 'NewsAPI.org',
    publishedAt: rawArticle.publishedAt || new Date().toISOString(),
    author: rawArticle.author || 'YangiliklarUz',
    slug: makeArticleSlug(rawArticle),
  };
}

export function normalizeArticles(list = []) {
  return (list || [])
    .filter((article) => article && article.title)
    .map((article) => normalizeArticle(article))
    .filter(Boolean);
}

async function fetchFromNewsApi(path, params = {}) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('NewsAPI kaliti topilmadi. .env.local tarkibini tekshiring.');
  }

  try {
    const url = new URL(`${NEWS_API_BASE_URL}/${path}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
    url.searchParams.set('apiKey', apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 600 },
    });

    if (response.status === 429) {
      throw new Error('So\'rovlar limiti tugadi. Bir daqiqadan keyin qayta urinib ko\'ring.');
    }

    if (!response.ok) {
      let message = 'Yangiliklar ma\'lumotlari hozirda mavjud emas.';
      try {
        const body = await response.json();
        if (body?.message) message = body.message;
      } catch {
        // Ignore JSON parse failures and keep the fallback.
      }
      throw new Error(message);
    }

    const data = await response.json();
    if (data?.status !== 'ok') {
      throw new Error('Qidiruv natijalari olinmadi. Iltimos, keyinroq qayta urinib ko\'ring.');
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      return { status: 'ok', articles: [], totalResults: 0 };
    }

    if (error instanceof Error && /fetch failed|ECONNRESET|429|rate limit/i.test(error.message)) {
      return { status: 'ok', articles: [], totalResults: 0 };
    }

    throw error;
  }
}

export async function getTopHeadlines({ category = 'general', page = 1, pageSize = 9 } = {}) {
  const topCategory = CATEGORY_BY_CATEGORY[category]?.category || category || 'general';

  const data = await fetchFromNewsApi('top-headlines', {
    country: 'us',
    category: topCategory,
    page,
    pageSize,
  });

  return {
    articles: normalizeArticles(data.articles || []),
    totalResults: data.totalResults || 0,
  };
}

export async function searchNews(query, page = 1, pageSize = 9) {
  const searchTerm = sanitizeText(query).trim();
  if (!searchTerm) {
    return { articles: [], totalResults: 0 };
  }

  try {
    const data = await fetchFromNewsApi('everything', {
      q: searchTerm,
      sortBy: 'publishedAt',
      language: 'en',
      page,
      pageSize,
    });

    return {
      articles: normalizeArticles(data.articles || []),
      totalResults: data.totalResults || 0,
    };
  } catch (error) {
    return { articles: [], totalResults: 0 };
  }
}

export async function getArticleBySlug(slug) {
  if (!slug || !String(slug).trim()) return null;

  const candidate = String(slug).trim();
  const withoutHash = candidate.replace(/-[a-z0-9]{8}$/, '');
  const query = sanitizeText(withoutHash).replace(/-/g, ' ');
  const searchString = query || 'latest news';

  try {
    const data = await fetchFromNewsApi('everything', {
      qInTitle: searchString,
      sortBy: 'publishedAt',
      language: 'en',
      pageSize: 20,
    });

    const found = (data.articles || []).find((article) => makeArticleSlug(article) === candidate);
    if (!found) return null;

    return normalizeArticle(found);
  } catch (error) {
    return null;
  }
}

export function getHomeUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
