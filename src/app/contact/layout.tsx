import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact & Hire - Book Amy Hughes for Acting & Voiceover Work',
  description: 'Hire Amy Hughes for professional acting, comedy, improv, or voiceover projects. Dublin-based Irish actress and voice talent represented by British American Talent (acting) and Volcanic Talent (voiceover). Available for screen, stage, and commercial voice work across Ireland and the UK.',
  keywords: [
    'hire Irish actress',
    'book Dublin actor',
    'hire voiceover artist Ireland',
    'Irish talent for hire',
    'Dublin performer contact',
    'comedy actress for hire',
    'improviser for hire Dublin',
    'voiceover talent Ireland',
    'Irish actress representation',
    'casting Dublin'
  ],
  openGraph: {
    title: 'Contact Amy Hughes - Professional Irish Actress & Voiceover Artist',
    description: 'Book Amy Hughes for acting, comedy, or voiceover work. Professional Irish talent available for screen, stage, and voice projects.',
  },
  alternates: {
    canonical: 'https://amyhughes.ie/contact'
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
