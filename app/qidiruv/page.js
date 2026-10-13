import Link from 'next/link';
import { notFound } from 'next/navigation';
import { searchNews } from '../../lib/news';
import { SiteHeader } from '../../components/SiteHeader';
import { NewsCard } from '../../components/NewsCard';
import { Footer } from '../../components/Footer';
import { ScrollToTop } from '../../components/ScrollToTop';
import styles from './page.module.css';

export const dynamic = 'force-static';

export async function generateMetadata({ searchParams }) {
  const query = searchParams.q || 'Qidiruv';

  return {
    title: `"${query}" bo\'yicha qidiruv`,
    description: `${query} so\'zi bo\'yicha topilgan eng so\'nggi yangiliklar.`,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/qidiruv?q=${encodeURIComponent(query)}`,
    },
  };
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q || '';
  if (!query) {
    notFound();
  }

  const result = await searchNews(query, 1, 9);
  const articles = result.articles || [];

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className="container">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Bosh sahifa</Link>
            <span>/</span>
            <span>Qidiruv: {query}</span>
          </nav>

          <section aria-labelledby="search-results-heading">
            <h1 id="search-results-heading" className={styles.heading}>
              “{query}” bo‘yicha natijalar
            </h1>

            {articles.length ? (
              <div className={styles.grid}>
                {articles.map((article) => (
                  <NewsCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>Hech qanday natija topilmadi. Boshqa so\'z bilan qidiring.</div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
