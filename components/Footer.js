import Link from 'next/link';
import { CATEGORY_OPTIONS } from '../lib/news';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div>
            <Link href="/" className={styles.brand}>
              <span className={styles.brandMark}>Y</span>
              <span>YangiliklarUz</span>
            </Link>
            <p className={styles.copy}>Ma\'lumotlar NewsAPI.org dan olingan.</p>
          </div>

          <nav className={styles.links} aria-label="Footer kategoriyalari">
            {CATEGORY_OPTIONS.map((item) => (
              <Link key={item.slug} href={`/kategoriya/${item.slug}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
