import Image from 'next/image'

export default function Footer() {
  return (
    <footer>
      <a href="https://app.spotlight.com/1711-3423-8112" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/images/Spotlight-Logo-light-theme.png" 
          alt="Spotlight" 
          width={72}
          height={72}
        />
      </a>
      <a href="https://www.imdb.com/name/nm4806670/" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/images/imdb-logo-light-theme.png" 
          alt="IMDB" 
          width={72}
          height={72}
        />
      </a>
      <a href="https://www.instagram.com/amyhoo_?igsh=eGhkbmI2cmluNXkz&utm_source=qr" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/images/instagram-logo-light-theme.png" 
          alt="Instagram" 
          width={72}
          height={72}
        />
      </a>
      <a href="https://volcanictalent.com/artists/amy-hughes" target="_blank" rel="noopener noreferrer">
        <Image 
          src="/images/Volcanic-logo-light-theme.png" 
          alt="Volcanic Talent" 
          width={72}
          height={72}
        />
      </a>
    </footer>
  )
}
