import Link from 'next/link';
import Image from 'next/image';
import { getTopHeadlines, getCategoryLabel } from '../lib/news';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { NewsCard } from '../components/NewsCard';
import { ScrollToTop } from '../components/ScrollToTop';
import styles from './page.module.css';

export const revalidate = 600;

export default async function HomePage() {
  const data = await getTopHeadlines({ category: 'general', page: 1, pageSize: 9 });
  const articles = data.articles || [];
  const feature = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className="container">
          <section className={styles.heroWrap} aria-label="Taniqli yangilik">
            {feature ? (
              <article className={styles.heroCard}>
                <div className={styles.heroMedia}>
                  <Image
                    src={feature.image || '/default-article.svg'}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 55vw"
                    priority
                    className={styles.heroImage}
                  />
                </div>
                <div className={styles.heroContent}>
                  <span className={styles.heroBadge}>Top story</span>
                  <h1 className={styles.heroTitle}>{feature.title}</h1>
                  <p className={styles.heroDescription}>{feature.description || 'Bu maqola haqida qisqacha ma\'lumot mavjud emas.'}</p>
                  <div className={styles.heroMeta}>
                    <span>{feature.source}</span>
                    <span>{new Date(feature.publishedAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className={styles.heroActions}>
                    <Link href={`/yangilik/${feature.slug}`} className={styles.primaryButton}>
                      Batafsil
                    </Link>
                    <Link href="/kategoriya/barchasi" className={styles.secondaryButton}>
                      Barcha yangiliklar
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <div className={styles.emptyHero}>Yangiliklar mavjud emas.</div>
            )}
          </section>

          <section className={styles.section} aria-labelledby="latest-news-heading">
            <div className={styles.sectionHeader}>
              <h2 id="latest-news-heading">Eng so'nggi yangiliklar</h2>
              <Link href="/kategoriya/barchasi" className={styles.sectionLink}>
                Barchasi
              </Link>
            </div>

            <div className={styles.newsGrid}>
              {gridArticles.map((article) => (
                <NewsCard key={article.slug} article={article} />
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

export const metadata = {
  title: 'YangiliklarUz | So\'ngi yangiliklar',
  description:
    'YangiliklarUz sayti orqali biznes, texnologiya, sport, fan, sog\'liq va ko\'ngilochar yangiliklarini o\'qing.',
  alternates: {
    canonical: '/',
  },
};
