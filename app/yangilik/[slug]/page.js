import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getTopHeadlines } from '../../../lib/news';
import { SiteHeader } from '../../../components/SiteHeader';
import { Footer } from '../../../components/Footer';
import { NewsCard } from '../../../components/NewsCard';
import { ScrollToTop } from '../../../components/ScrollToTop';
import styles from './page.module.css';

export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return {
      title: 'Yangilik topilmadi',
    };
  }

  return {
    title: article.title,
    description: article.description || 'Yangilik haqida qisqacha ma\'lumot.',
    alternates: {
      canonical: `/yangilik/${params.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description || 'Yangilik haqida qisqacha ma\'lumot.',
      images: [article.image || '/opengraph-image'],
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description || 'Yangilik haqida qisqacha ma\'lumot.',
      images: [article.image || '/opengraph-image'],
    },
  };
}

export default async function ArticlePage({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const related = await getTopHeadlines({ category: 'general', page: 1, pageSize: 3 });
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.image || '/opengraph-image'],
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.source,
    },
    publisher: {
      '@type': 'Organization',
      name: 'YangiliklarUz',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/${params.slug}`,
    },
  };

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className="container">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Bosh sahifa</Link>
            <span>/</span>
            <span>{article.title}</span>
          </nav>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <article className={styles.article}>
            <header className={styles.hero}>
              <div className={styles.imageWrap}>
                <Image
                  src={article.image || '/default-article.svg'}
                  alt={article.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 65vw"
                  priority
                  className={styles.image}
                />
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.source}>{article.source}</span>
                <time dateTime={article.publishedAt} className={styles.date}>
                  {new Date(article.publishedAt).toLocaleDateString('uz-UZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <h1 className={styles.title}>{article.title}</h1>
            </header>

            <div className={styles.content}>
              <p>{article.description || 'Bu yangilik haqida qisqa tavsif mavjud emas.'}</p>
              <p>{article.content || 'Maqola haqida batafsil tavsif mavjud emas, lekin asl manbada ko\'proq ma\'lumotni o\'qishingiz mumkin.'}</p>
            </div>

            <div className={styles.actions}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                Asl manbada o\'qish
              </a>
              <Link href="/" className={styles.secondaryButton}>
                Bosh sahifa
              </Link>
            </div>
          </article>

          <section className={styles.related} aria-labelledby="related-heading">
            <h2 id="related-heading">Tavsiya etilgan</h2>
            <div className={styles.relatedGrid}>
              {(related.articles || []).slice(0, 3).map((item) => (
                <NewsCard key={item.slug} article={item} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
