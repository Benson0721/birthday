import type { GiftId, GiftImage } from '../content/gifts'

export function BirthdayArtwork({ artwork, className = '' }: { artwork: GiftImage; className?: string }) {
  return <img className={`birthday-artwork ${className}`} src={`${import.meta.env.BASE_URL}artwork/birthday-collection/${artwork.file}`} alt={artwork.alt} draggable={false} decoding="async" width={1254} height={1254} />
}

export function StationeryAnimal({ kind, className = '' }: { kind: 'duck' | 'friends'; className?: string }) {
  return <img className={`stationery-animal ${className}`} src={`${import.meta.env.BASE_URL}artwork/${kind === 'duck' ? 'birthday-collection/happy-duck' : 'puppy-kitten'}.png`} alt="" aria-hidden="true" draggable={false} decoding="async" width={kind === 'duck' ? 1254 : 1752} height={kind === 'duck' ? 1254 : 897} />
}

export function MoonStars({ className = '' }: { className?: string }) {
  return (
    <svg className={`stationery-motif ${className}`} viewBox="0 0 90 90" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M45 23a22 22 0 1 0 17 35A23 23 0 0 1 45 23Z" fill="var(--color-moon)" fillOpacity=".7" />
        <path d="m69 15 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="var(--color-moon)" fillOpacity=".8" />
        <path d="M19 15v8m-4-4h8m47 49v6m-3-3h6" opacity=".7" />
        <circle cx="16" cy="58" r="1" fill="currentColor" stroke="none" />
        <circle cx="56" cy="78" r="1" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

export function GiftArtwork({ kind, className = '' }: { kind: GiftId; className?: string }) {
  return (
    <svg className={`gift-artwork gift-artwork--${kind} ${className}`} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <ellipse cx="80" cy="133" rx="49" ry="7" fill="currentColor" opacity=".08" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'steam' ? <>
          <path d="M34 57 116 48 126 121 44 131Z" fill="#e4dce9" />
          <path d="m30 49 86-9 4 20-87 10Z" fill="#eee7f0" />
          <path d="m69 45 14-2 10 82-15 2Z" fill="#c8b2c8" />
          <path d="M76 44C45 47 50 16 67 29L77 43C74 19 99 20 95 33C93 40 84 44 76 44Z" fill="#efe7ee" />
          <path d="m98 77 15 4-3 23-16-4Z" fill="#fff9f2" />
          <path d="m100 87 7 2m-4-5-1 8" />
          <path d="m50 91 7 1m-3-4-1 7" opacity=".6" />
        </> : kind === 'thai' ? <>
          <path d="M37 76C39 47 58 33 81 33s43 14 45 43Z" fill="#e8d3c3" />
          <path d="M31 77h101v11H31Z" fill="#f2e4d5" />
          <path d="M72 33v-4a9 9 0 0 1 18 0v4" />
          <path d="M44 104c6 20 22 26 38 26s33-7 39-26Z" fill="#fff9f2" />
          <path d="M35 102h93M23 55v68m-5-68v18c0 7 10 7 10 0V55M141 55v68m-3-68c-6 17-6 28 3 29" />
          <path d="M67 58c-4-5-4-10 1-14m15 12c-4-5-3-9 1-13m13 18c-3-4-3-8 1-12" opacity=".6" />
        </> : <>
          <path d="m43 48 69 6-5 75-71-6Z" fill="#e8cbd1" />
          <path d="m39 44 78 7-2 19-79-7Z" fill="#f1dce0" />
          <path d="m73 47 13 1-7 79-13-1Z" fill="#c498a7" />
          <path d="M79 47C57 45 51 27 60 24C71 20 78 37 79 47ZM80 47c1-21 19-27 23-18C107 39 92 47 80 47Z" fill="#f3e4e6" />
          <path d="m100 83 2 6 7 1-6 4 1 7-6-4-6 3 2-7-4-5 7 1Z" fill="#f6e58b" />
          <path d="m24 31 2-6m-8 3 6 3m104 66 5-2m-2 8-3-5M125 32v8m-4-4h8" />
        </>}
      </g>
    </svg>
  )
}

export function ArrowIcon({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="arrow-icon" style={back ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function ReturnEnvelopeIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="return-envelope-icon"><path d="M8 6h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3m2-7 6 5 6-5M4 4v7m0 0L1.5 8.5M4 11l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
