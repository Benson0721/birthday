import type { RefObject } from 'react'
import type { EnvelopePhase } from '../app/letterFlow'
import { BirthdayArtwork, MoonStars, StationeryAnimal } from './Artwork'

type Props = {
  phase: EnvelopePhase
  cardRef: RefObject<HTMLSpanElement | null>
  triggerRef: RefObject<HTMLButtonElement | null>
  onOpen: () => void
  onFlapOpened: () => void
  onCardExtracted: () => void
  onCardInserted: () => void
  onFlapClosed: () => void
}

export function EnvelopeScene({ phase, cardRef, triggerRef, onOpen, onFlapOpened, onCardExtracted, onCardInserted, onFlapClosed }: Props) {
  return (
    <div className="envelope-stage" data-phase={phase} aria-hidden={phase !== 'floating'} inert={phase !== 'floating'}>
      <header className="envelope-intro"></header>
      <div className="envelope-scene">
        <span className="envelope-shadow" aria-hidden="true" />
        <button type="button" ref={triggerRef} className="envelope-trigger" aria-label="打開生日信" onClick={onOpen} disabled={phase !== 'floating'}>
          <span className="envelope-float">
            <span className="envelope-assembly" aria-hidden="true">
              <span className="envelope-back" />
              <span className="envelope-card" ref={cardRef} onAnimationEnd={(event) => {
                if (event.target === event.currentTarget && event.animationName === 'card-extract') onCardExtracted()
                if (event.target === event.currentTarget && event.animationName === 'card-insert') onCardInserted()
              }}><StationeryAnimal kind="duck" className="card-duck" /><span className="card-greeting">估估嘎嘎</span></span>
              <span className="envelope-pocket" />
              <span className="envelope-bottom-fold" />
              <svg className="envelope-seams" viewBox="0 0 420 280" fill="none"><path d="M0 280 210 141 420 280" stroke="currentColor" strokeWidth="1" /></svg>
              <BirthdayArtwork artwork={{ file: 'lavender.png', alt: '' }} className="envelope-lavender" />
             
              <span className="envelope-flap" onAnimationEnd={(event) => {
                if (event.target === event.currentTarget && event.animationName === 'flap-open') onFlapOpened()
                if (event.target === event.currentTarget && event.animationName === 'flap-close') onFlapClosed()
              }} />
              <span className="envelope-seal"><MoonStars /></span>
            </span>
          </span>
        </button>
      </div>
      <div className="envelope-invitation"></div>
    </div>
  )
}
