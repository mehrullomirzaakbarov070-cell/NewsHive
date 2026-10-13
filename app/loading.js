import styles from './loading.module.css';

export default function Loading() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.heroSkeleton} />
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.media} />
            <div className={styles.content}>
              <div className={styles.lineShort} />
              <div className={styles.lineFull} />
              <div className={styles.lineFull} />
              <div className={styles.button} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
