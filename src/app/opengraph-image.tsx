import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Amy Hughes - Actor & Comedian'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 200,
            color: '#C28950',
            fontWeight: 'bold',
            fontFamily: 'serif',
            marginBottom: 20,
          }}
        >
          AH
        </div>
        <div
          style={{
            fontSize: 48,
            color: '#C28950',
            fontFamily: 'serif',
          }}
        >
          Amy Hughes
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#666',
            fontFamily: 'sans-serif',
            marginTop: 10,
          }}
        >
          Actor & Comedian
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
