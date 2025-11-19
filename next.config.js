/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'img.evbuc.com',
      },
      {
        protocol: 'https',
        hostname: 'www.eventbrite.ie',
      },
      {
        protocol: 'https',
        hostname: 'smockalley.com',
      },
      {
        protocol: 'https',
        hostname: 'www.fringefest.com',
      },
      {
        protocol: 'https',
        hostname: '**.evbuc.com',
      },
      {
        protocol: 'https',
        hostname: '**.eventbrite.ie',
      },
      {
        protocol: 'https',
        hostname: '**.eventbrite.com',
      },
    ],
  },
}

module.exports = nextConfig
