import Image from 'next/image';
import Link from 'next/link';
import styles from './NewsCard.module.css';

export function NewsCard({ article }) {
  const publishedDate = article?.publishedAt ? new Date(article.publishedAt).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) : 'Yaqinda';

  return (
    <article className={`${styles.card} cardGlow`}>
      <div className={styles.mediaWrap}>
        <Image
          src={article.image || '/default-article.svg'}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{article.source}</span>
          <span>{publishedDate}</span>
        </div>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.description}>{article.description || 'Bu maqola haqida qisqacha ma\'lumot mavjud emas.'}</p>
        <Link href={`/yangilik/${article.slug}`} className={styles.button} rel="noopener noreferrer">
          Batafsil
        </Link>
      </div>
    </article>
  );
}
