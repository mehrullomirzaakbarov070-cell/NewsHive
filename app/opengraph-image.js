import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #071425 0%, #1d2a4d 35%, #0f172a 100%)',
          padding: 64,
          color: '#edf2ff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 28,
            }}
          >
            Y
          </div>
          <div style={{ fontSize: 32, letterSpacing: -2, fontWeight: 700 }}>YangiliklarUz</div>
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.1, letterSpacing: -4, fontWeight: 800 }}>
          So&apos;ngi yangiliklar
        </div>
        <div style={{ marginTop: 20, fontSize: 28, color: '#b7c7d9' }}>
          Biznes, texnologiya, sport, fan va ko&apos;ngilochar yangiliklar
        </div>
      </div>
    ),
    { ...size }
  );
}
