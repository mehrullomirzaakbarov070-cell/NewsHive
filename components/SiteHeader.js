'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORY_OPTIONS } from '../lib/news';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const router = useRouter();
  const categoryLinks = useMemo(() => CATEGORY_OPTIONS.filter((item) => item.slug !== 'barchasi'), []);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yangiliklaruz-theme', theme);
  }, [theme]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/qidiruv?q=${encodeURIComponent(trimmed)}`);
    setMobileOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} aria-label="Bosh sahifa">
            <span className={styles.logoMark}>Y</span>
            <span className={styles.logoText}>YangiliklarUz</span>
          </Link>

          <nav className={`${styles.categoryNav} ${mobileOpen ? styles.categoryNavOpen : ''}`} aria-label="Kategoriyalar">
            <Link href="/kategoriya/barchasi" className={styles.categoryLink}>Barchasi</Link>
            {categoryLinks.map((item) => (
              <Link key={item.slug} href={`/kategoriya/${item.slug}`} className={styles.categoryLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <form onSubmit={handleSubmit} className={styles.searchWrap}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.searchIcon}>
                <path d="M10.5 3a7.5 7.5 0 015.88 12.8l4.4 4.4 1.4-1.4-4.4-4.4A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" />
              </svg>
              <input
                aria-label="Yangilikni qidiring"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Qidiruv..."
              />
            </form>

            <button
              type="button"
              className={styles.themeToggle}
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? 'Yorug\' rejimga o\'tish' : 'Qora rejimga o\'tish'}
            >
              <span className={styles.toggleThumb} />
            </button>

            <button
              type="button"
              className={styles.menuButton}
              aria-label="Menyu"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
