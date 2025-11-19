import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acting Portfolio - Screen, Stage & Comedy Work',
  description: 'View Amy Hughes\' acting portfolio featuring screen credits (Who We Love, Vikings, Poster Boys), stage performances, comedy work, and improvised theatre. Dublin-based Irish actress specializing in dark comedy drama and character roles.',
  keywords: [
    'Amy Hughes acting portfolio',
    'Irish screen actor',
    'Dublin stage actress',
    'Irish TV actor',
    'Irish film actress',
    'comedy actress Ireland',
    'Irish theatre actor',
    'character actress Dublin'
  ],
  openGraph: {
    title: 'Amy Hughes - Acting Portfolio | Irish Screen & Stage Actress',
    description: 'Award-winning Irish actress featuring work in film, television, and theatre. Dark comedy specialist with roles in Vikings, Who We Love, and Irish theatre.',
  },
  alternates: {
    canonical: 'https://amyhughes.ie/acting'
  }
}

export default function ActingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
