import Link from 'next/link'

export default function Navigation() {
  return (
    <nav style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
      <Link href="/" style={{
        color: '#C28950',
        fontSize: '3.12rem',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
        marginRight: 'auto',
        fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
        textDecoration: 'none'
      }}>Amy Hughes</Link>
      <div style={{ display: 'flex', gap: '3rem', marginRight: 'auto', marginLeft: 'auto' }}>
        <Link href="/" style={{
          color: '#C28950',
          textDecoration: 'none',
          fontSize: '3.12rem',
          textTransform: 'uppercase'
        }}>Amy</Link>
        <Link href="/acting" style={{
          color: '#C28950',
          textDecoration: 'none',
          fontSize: '3.12rem',
          textTransform: 'uppercase'
        }}>Work</Link>
        <Link href="/contact" style={{
          color: '#C28950',
          textDecoration: 'none',
          fontSize: '3.12rem',
          textTransform: 'uppercase'
        }}>Contact</Link>
      </div>
    </nav>
  )
}
