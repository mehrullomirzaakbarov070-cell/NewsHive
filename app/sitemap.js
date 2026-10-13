import { getTopHeadlines, CATEGORY_OPTIONS } from '../lib/news';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const categories = CATEGORY_OPTIONS.map((item) => ({
    url: `${baseUrl}/kategoriya/${item.slug}`,
    lastModified: new Date(),
  }));

  let latestArticles = [];
  try {
    const result = await getTopHeadlines({ category: 'general', page: 1, pageSize: 8 });
    latestArticles = result.articles || [];
  } catch {
    latestArticles = [];
  }

  const articleUrls = latestArticles.map((article) => ({
    url: `${baseUrl}/yangilik/${article.slug}`,
    lastModified: new Date(article.publishedAt),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    ...categories,
    ...articleUrls,
  ];
}
