import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Fixaro - Магазин за инструменти';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '60px',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: '#f59e0b',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
            }}
          >
            F
          </div>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#f59e0b',
            }}
          >
            Fixaro
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '36px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Качествени инструменти на достъпни цени
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            fontSize: '24px',
            color: '#cbd5e1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#22c55e' }}>✓</span> Бърза доставка
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#22c55e' }}>✓</span> Наложен платеж
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#22c55e' }}>✓</span> Гаранция
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '24px',
            color: '#64748b',
          }}
        >
          fixaro.bg
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
