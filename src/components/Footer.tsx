import Image from 'next/image'

export default function Footer() {
  return (
    <footer>
      <a href="https://app.spotlight.com/1711-3423-8112" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/images/spotlight-logo-light-theme.png" 
          alt="Spotlight" 
          width={40}
          height={40}
        />
      </a>
      <a href="https://www.imdb.com/name/nm4806670/" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/images/imdb-logo-light-theme.png" 
          alt="IMDB" 
          width={40}
          height={40}
        />
      </a>
      <a href="https://www.instagram.com/amyhoo_?igsh=eGhkbmI2cmluNXkz&utm_source=qr" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/images/instagram-logo-light-theme.png" 
          alt="Instagram" 
          width={40}
          height={40}
        />
      </a>
      <a href="https://volcanictalent.com/artists/amy-hughes" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/images/volcanic-logo-light-theme.png" 
          alt="Volcanic Talent" 
          width={112}
          height={112}
        />
      </a>
    </footer>
  )
}
