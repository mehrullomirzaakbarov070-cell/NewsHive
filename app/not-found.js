import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)', marginBottom: '0.75rem' }}>404</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.4rem' }}>Sahifa topilmadi.</p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            padding: '0.8rem 1.2rem',
            borderRadius: '0.9rem',
            background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  );
}
