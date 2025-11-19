import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Amy Hughes - Irish Actress, Comedian & Voiceover Artist | Dublin Actor',
    template: '%s | Amy Hughes'
  },
  description: 'Amy Hughes is a Dublin-based actress, comedian, improviser, and voiceover artist of Welsh-Kiwi descent. Specializing in dark comedy drama, character acting, and vocal performances across Irish, English, and Welsh accents. Available for screen, stage, and commercial voiceover work.',
  keywords: [
    'Amy Hughes actor',
    'Amy Hughes actress', 
    'Dublin actress',
    'Irish actress',
    'Irish comedian',
    'Dublin voiceover artist',
    'Irish voiceover artist',
    'improviser Dublin',
    'comedy actress Ireland',
    'character actor Ireland',
    'Irish accent voice actor',
    'female voiceover Ireland'
  ],
  authors: [{ name: 'Amy Hughes' }],
  creator: 'Amy Hughes',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://amyhughes.ie',
    siteName: 'Amy Hughes - Professional Actor & Performer',
    title: 'Amy Hughes - Irish Actress, Comedian & Voiceover Artist',
    description: 'Professional Dublin-based actress, comedian, improviser, and voiceover talent specializing in dark comedy, character work, and versatile vocal performances.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Amy Hughes - Irish Actor, Comedian & Voiceover Artist'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amy Hughes - Irish Actress & Voiceover Artist',
    description: 'Dublin-based actress, comedian, and voiceover talent. Screen, stage, and commercial voice work.',
    creator: '@amyhughes',
    images: ['/opengraph-image']
  },
  alternates: {
    canonical: 'https://amyhughes.ie'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Amy Hughes',
              url: 'https://amyhughes.ie',
              jobTitle: ['Actress', 'Comedian', 'Voice Actor', 'Improviser'],
              description: 'Dublin-based actress, comedian, improviser, and voiceover artist specializing in dark comedy, character acting, and vocal performances.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dublin',
                addressCountry: 'IE'
              },
              nationality: ['Irish', 'Welsh', 'New Zealand'],
              knowsLanguage: ['English'],
              performerIn: {
                '@type': 'PerformanceRole',
                characterName: 'Various',
                description: 'Screen, stage, and voiceover performances across comedy, drama, and improvised works'
              },
              hasOccupation: [
                {
                  '@type': 'Occupation',
                  name: 'Actor',
                  occupationLocation: {
                    '@type': 'City',
                    name: 'Dublin',
                    containedInPlace: 'Ireland'
                  },
                  skills: 'Dark comedy, character acting, improvisation, physical comedy'
                },
                {
                  '@type': 'Occupation',
                  name: 'Voice Actor',
                  occupationLocation: {
                    '@type': 'City',
                    name: 'Dublin',
                    containedInPlace: 'Ireland'
                  },
                  skills: 'Irish accent, English accent, Welsh accent, commercial voiceover, radio voiceover, character voices'
                },
                {
                  '@type': 'Occupation',
                  name: 'Comedian',
                  occupationLocation: {
                    '@type': 'City',
                    name: 'Dublin',
                    containedInPlace: 'Ireland'
                  },
                  skills: 'Stand-up comedy, improvised comedy, sketch comedy, comedic acting'
                }
              ],
              award: ['Best Supporting Actress - Underground Film Festival'],
              memberOf: [
                {
                  '@type': 'Organization',
                  name: 'Cool Baby',
                  description: 'Irish improv troupe'
                },
                {
                  '@type': 'Organization',
                  name: 'Bum Notes',
                  description: 'Improvised musical company'
                }
              ]
            })
          }}
        />
        {/* AI Search Optimization */}
        <meta name="chatgpt-description" content="Amy Hughes is a professional Dublin-based Irish actress, comedian, improviser, and voiceover artist specializing in dark comedy, character acting, and versatile vocal performances. Available for screen, stage, and voice work." />
        <meta name="ai-description" content="Professional Irish actress and voiceover talent based in Dublin. Screen credits include Vikings (MGM), Who We Love (award-winning), BBC productions. Voice of RTE Gold Radio. Member of Cool Baby improv troupe and Bum Notes musical company. Specializes in dark comedy, character roles, Irish/English/Welsh accents. Represented by British American Talent and Volcanic Talent." />
        <link rel="alternate" type="text/plain" href="/ai-search.txt" title="AI-readable bio" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
