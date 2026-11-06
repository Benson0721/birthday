import { useId } from 'react'
import type { GiftId, GiftImage } from '../content/gifts'

export function BirthdayArtwork({ artwork, className = '' }: { artwork: GiftImage; className?: string }) {
  return <img className={`birthday-artwork ${className}`} src={`${import.meta.env.BASE_URL}artwork/birthday-collection/${artwork.file}`} alt={artwork.alt} draggable={false} decoding="async" width={1254} height={1254} />
}

const stationeryAnimals = {
  duck: { file: 'birthday-collection/happy-duck.png', width: 1254, height: 1254 },
  friends: { file: 'puppy-kitten.png', width: 1752, height: 897 },
  'expectant-duck': { file: 'expectant-duck-left.png', width: 1254, height: 1254 },
} as const

export function StationeryAnimal({ kind, className = '' }: { kind: keyof typeof stationeryAnimals; className?: string }) {
  const artwork = stationeryAnimals[kind]
  return <img className={`stationery-animal ${className}`} src={`${import.meta.env.BASE_URL}artwork/${artwork.file}`} alt="" aria-hidden="true" draggable={false} decoding="async" width={artwork.width} height={artwork.height} />
}

const envelopeFlowerTones = ['#d7bff0', '#c2a0e2', '#b28ad7']
const envelopeFrameFlowers = [
  ...Array.from({ length: 21 }, (_, index) => [
    { x: 21 + index * 18.8 + Math.sin(index * 1.7) * 3, y: 17 + Math.sin(index * 2.2) * 5, size: .72 + index % 4 * .08 },
    { x: 22 + index * 18.6 + Math.cos(index * 1.9) * 3, y: 262 + Math.cos(index * 2.1) * 5, size: .7 + index % 3 * .1 },
  ]).flat(),
  ...Array.from({ length: 6 }, (_, index) => [
    { x: 18 + Math.sin(index) * 3, y: 42 + index * 37, size: .86 },
    { x: 12, y: 51 + index * 37, size: .64 },
    { x: 27, y: 55 + index * 37, size: .74 },
    { x: 400 + Math.cos(index) * 2, y: 41 + index * 37, size: .84 },
    { x: 391, y: 51 + index * 37, size: .74 },
    { x: 408, y: 55 + index * 37, size: .63 },
  ]).flat(),
]
const envelopeFrameLeaves = [
  ...Array.from({ length: 19 }, (_, index) => [
    { x: 32 + index * 19.2, y: 17, angle: index % 2 ? 155 : 8 },
    { x: 33 + index * 19.1, y: 262, angle: index % 2 ? 182 : 8 },
  ]).flat(),
  ...Array.from({ length: 10 }, (_, index) => [
    { x: 18, y: 47 + index * 21, angle: index % 2 ? -115 : 50 },
    { x: 400, y: 45 + index * 21, angle: index % 2 ? 50 : -135 },
  ]).flat(),
]

export function LavenderEnvelopeFrame() {
  const id = useId()
  return <svg className="envelope-lavender-frame" viewBox="0 0 420 280" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <g id={`${id}-flower`}>
        {[0, 72, 144, 216, 288].map(angle => <ellipse key={angle} cx="0" cy="-4.7" rx="3.6" ry="4.8" transform={`rotate(${angle})`} fill="currentColor" />)}
        <circle r="2.4" fill="#a47ac6" />
      </g>
      <path id={`${id}-leaf`} d="M0 0C5-9 12-12 18-12C14-5 8-1 0 0Z" fill="#aec2a4" />
    </defs>
    {[true, false].map(top => <g key={String(top)} className={top ? 'envelope-frame-top' : 'envelope-frame-body'}>
      <path d={top
        ? 'M18 38C13 17 30 12 54 18S111 12 144 18S208 12 242 18S309 12 344 18S388 12 401 24'
        : 'M401 24C396 59 406 88 400 120S406 181 400 215S405 256 394 263C359 258 328 268 294 262S229 268 194 262S128 268 94 262S32 269 19 258C23 223 13 194 19 162S12 100 18 68S17 49 18 38'} stroke="#a6b79d" strokeWidth="1.5" strokeLinecap="round" />
      {envelopeFrameLeaves.map((leaf, index) => (leaf.y < 32) === top && <use key={`leaf-${index}`} href={`#${id}-leaf`} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(.72)`} />)}
      {envelopeFrameFlowers.map((flower, index) => (flower.y < 32) === top && <use key={`flower-${index}`} href={`#${id}-flower`} transform={`translate(${flower.x} ${flower.y}) rotate(${index * 29 % 72}) scale(${flower.size})`} style={{ color: envelopeFlowerTones[index % envelopeFlowerTones.length] }} />)}
    </g>)}
  </svg>
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

export function GiftArtwork({ kind, opened = false, className = '' }: { kind: GiftId; opened?: boolean; className?: string }) {
  return (
    <svg className={`gift-artwork gift-artwork--${kind} ${className}`} data-artwork-state={opened ? 'opened' : 'closed'} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <ellipse cx="80" cy="133" rx="49" ry="7" fill="currentColor" opacity=".08" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'steam' && (opened ? <>
          <path d="m37 69 79-8 10 63-80 10Z" fill="#e4dce9" />
          <path d="m37 69 79-8 10 14-79 8Z" fill="#fff9f2" />
          <path d="m74 80 14-2 8 50-14 2Z" fill="#c8b2c8" />
          <path d="m31 37 77-12 9 17-79 13Z" fill="#eee7f0" />
          <path d="m69 31 13-2 7 18-13 3Z" fill="#c8b2c8" />
          <path d="M76 29C56 31 47 14 57 12C66 10 74 21 76 29ZM76 29c2-17 20-22 23-13C102 24 87 29 76 29Z" fill="#efe7ee" />
          <path d="m87 48 3 7 8 1-6 5 1 8-7-4-7 4 2-8-6-5 8-1Z" fill="#f6e58b" />
          <path d="M29 62v8m-4-4h8m88-19 3-4m1 11 5 1" opacity=".7" />
          <path d="m54 105 7 1m-3-4-1 7" opacity=".6" />
        </> : <>
          <path d="M34 57 116 48 126 121 44 131Z" fill="#e4dce9" />
          <path d="m30 49 86-9 4 20-87 10Z" fill="#eee7f0" />
          <path d="m69 45 14-2 10 82-15 2Z" fill="#c8b2c8" />
          <path d="M76 44C45 47 50 16 67 29L77 43C74 19 99 20 95 33C93 40 84 44 76 44Z" fill="#efe7ee" />
          <path d="m98 77 15 4-3 23-16-4Z" fill="#fff9f2" />
          <path d="m100 87 7 2m-4-5-1 8" />
          <path d="m50 91 7 1m-3-4-1 7" opacity=".6" />
        </>)}
        {kind === 'thai' && (opened ? <>
          <g transform="translate(-10 -17) rotate(-12 80 65)">
            <path d="M37 76C39 47 58 33 81 33s43 14 45 43Z" fill="#e8d3c3" />
            <path d="M31 77h101v9H31Z" fill="#f2e4d5" />
            <path d="M72 33v-4a9 9 0 0 1 18 0v4" />
          </g>
          <path d="M43 102c5 20 22 28 39 28s34-8 39-28Z" fill="#fff9f2" />
          <ellipse cx="82" cy="100" rx="44" ry="9" fill="#f2e4d5" />
          <path d="M63 98c0-9 15-9 15 0m10 0c0-10 16-9 16 0" fill="#e7b5a1" />
          <path d="M107 85c-6-7 5-8 0-16m13 13c-5-5 4-8 1-13" opacity=".7" />
          <path d="M23 76v47m-5-47v12c0 7 10 7 10 0V76m113 0v47m-3-47c-5 10-4 16 3 17" />
          <path d="M123 42v8m-4-4h8" opacity=".6" />
        </> : <>
          <path d="M37 76C39 47 58 33 81 33s43 14 45 43Z" fill="#e8d3c3" />
          <path d="M31 77h101v11H31Z" fill="#f2e4d5" />
          <path d="M72 33v-4a9 9 0 0 1 18 0v4" />
          <path d="M44 104c6 20 22 26 38 26s33-7 39-26Z" fill="#fff9f2" />
          <path d="M35 102h93M23 55v68m-5-68v18c0 7 10 7 10 0V55M141 55v68m-3-68c-6 17-6 28 3 29" />
          <path d="M67 58c-4-5-4-10 1-14m15 12c-4-5-3-9 1-13m13 18c-3-4-3-8 1-12" opacity=".6" />
        </>)}
        {kind === 'mystery' && (opened ? <>
          <path d="m43 67 69 6-5 58-71-6Z" fill="#e8cbd1" />
          <path d="m43 67 69 6 7 13-81-6Z" fill="#fff9f2" />
          <path d="m72 82 14 1-5 46-14-1Z" fill="#c498a7" />
          <path d="m49 33 72 20-4 16-72-20Z" fill="#f1dce0" />
          <path d="m78 41 12 3-5 16-12-3Z" fill="#c498a7" />
          <path d="M83 42C65 34 61 17 70 14C81 12 85 30 83 42ZM84 42c7-21 24-25 27-15C113 37 95 43 84 42Z" fill="#f3e4e6" />
          <path d="m64 58 2 6 7 1-6 4 1 7-6-4-6 3 2-7-4-5 7 1Z" fill="#f6e58b" />
          <path d="M29 54v8m-4-4h8m97 30 5-2m-2 8-3-5" opacity=".7" />
          <path d="m98 103 2 5 6 1-5 4 1 6-5-3-5 2 1-6-3-4 5 1Z" fill="#f6e58b" />
        </> : <>
          <path d="m43 48 69 6-5 75-71-6Z" fill="#e8cbd1" />
          <path d="m39 44 78 7-2 19-79-7Z" fill="#f1dce0" />
          <path d="m73 47 13 1-7 79-13-1Z" fill="#c498a7" />
          <path d="M79 47C57 45 51 27 60 24C71 20 78 37 79 47ZM80 47c1-21 19-27 23-18C107 39 92 47 80 47Z" fill="#f3e4e6" />
          <path d="m100 83 2 6 7 1-6 4 1 7-6-4-6 3 2-7-4-5 7 1Z" fill="#f6e58b" />
          <path d="m24 31 2-6m-8 3 6 3m104 66 5-2m-2 8-3-5M125 32v8m-4-4h8" />
        </>)}
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
