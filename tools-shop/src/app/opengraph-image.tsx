import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Fixaro - Онлайн магазин за инструменти';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public/images/logo-wide.jpeg'));
  const logoBase64 = `data:image/jpeg;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Logo as full background */}
        <img
          src={logoBase64}
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Bottom bar with features */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            fontSize: '22px',
            color: '#e2e8f0',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '40px 30px 25px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4ade80' }}>✓</span> Бърза доставка
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4ade80' }}>✓</span> Наложен платеж
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4ade80' }}>✓</span> 2 год. гаранция
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
