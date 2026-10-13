import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsCard } from '../../../components/NewsCard';
import { SiteHeader } from '../../../components/SiteHeader';
import { Footer } from '../../../components/Footer';
import { ScrollToTop } from '../../../components/ScrollToTop';
import { CATEGORY_OPTIONS, CATEGORY_BY_SLUG, getCategoryLabel, getTopHeadlines } from '../../../lib/news';
import styles from './page.module.css';

export function generateStaticParams() {
  return CATEGORY_OPTIONS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const label = getCategoryLabel(slug);
  return {
    title: label,
    description: `${label} kategoriyasidagi eng so'nggi yangiliklar va tezkor xabarlar.`,
    alternates: {
      canonical: `/kategoriya/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const slug = params.slug;
  const category = CATEGORY_BY_SLUG[slug] || 'general';

  if (!CATEGORY_BY_SLUG[slug]) {
    notFound();
  }

  const result = await getTopHeadlines({ category, page: 1, pageSize: 9 });
  const articles = result.articles || [];
  const label = getCategoryLabel(slug);

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className="container">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Bosh sahifa</Link>
            <span>/</span>
            <span>{label}</span>
          </nav>

          <header className={styles.header}>
            <h1>{label}</h1>
            <p>{label} kategoriyasidagi yangiliklar va tezkor xabarlar.</p>
          </header>

          <section aria-label={label}>
            {articles.length ? (
              <div className={styles.grid}>
                {articles.map((article) => (
                  <NewsCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>Bu kategoriyada hozircha yangiliklar yo\'q.</div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
