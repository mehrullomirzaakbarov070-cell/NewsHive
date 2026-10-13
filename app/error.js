'use client';

export default function Error({ error, reset }) {
  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>Xatolik yuz berdi</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
          {error?.message || 'Yangiliklar ma\'lumotlari hozirda mavjud emas. Iltimos, keyinroq qayta urinib ko\'ring.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '0.8rem 1.25rem',
            borderRadius: '0.9rem',
            background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
            border: 'none',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          Qayta urinish
        </button>
      </div>
    </main>
  );
}
