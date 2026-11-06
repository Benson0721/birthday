import { useLayoutEffect, useRef, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { motionStyles } from '../app/motion'
import type { Gift } from '../content/gifts'
import { ArrowIcon, BirthdayArtwork, GiftArtwork } from './Artwork'

type Props = {
  gift: Gift
  closing: boolean
  onRequestClose: () => void
  onClosed: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}

export function GiftDetailOverlay({ gift, closing, onRequestClose, onClosed, returnFocus }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const backButton = useRef<HTMLButtonElement>(null)
  const touch = useRef<{ id: number; x: number; y: number } | null>(null)
  const lastTouchClose = useRef(0)

  useLayoutEffect(() => {
    const element = dialog.current
    if (!element) return
    const trigger = returnFocus.current
    const list = trigger?.closest<HTMLElement>('[data-scroll-face="back"]')
    const listScrollTop = list?.scrollTop
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!element.open) element.showModal()
    backButton.current?.focus({ preventScroll: true })
    return () => {
      if (element.open) element.close()
      document.body.style.overflow = previousOverflow
      if (list && listScrollTop !== undefined) list.scrollTop = listScrollTop
    }
  }, [returnFocus])

  return createPortal(
    // The modal is dismissed by a click, Escape or its keyboard-accessible return button.
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <dialog ref={dialog} id="gift-detail" aria-modal="true" aria-labelledby="gift-detail-title"
      className={`gift-overlay gift-overlay--${gift.id}`} data-closing={closing} style={motionStyles}
      onCancel={(event) => { event.preventDefault(); onRequestClose() }}
      onTouchStart={(event) => {
        const target = event.target
        const first = event.changedTouches[0]
        const button = target instanceof Element ? target.closest('button') : null
        if (!(target instanceof Element) || target.closest('a, input, select, textarea') || (button && button !== backButton.current) || event.touches.length !== 1 || !first) {
          touch.current = null
          return
        }
        touch.current = { id: first.identifier, x: first.clientX, y: first.clientY }
      }}
      onTouchMove={(event) => {
        const start = touch.current
        if (!start) return
        const point = Array.from(event.changedTouches).find(item => item.identifier === start.id)
        if (point && Math.hypot(point.clientX - start.x, point.clientY - start.y) > 10) touch.current = null
      }}
      onTouchCancel={() => { touch.current = null }}
      onTouchEnd={(event) => {
        const start = touch.current
        touch.current = null
        if (!start || closing) return
        const end = Array.from(event.changedTouches).find(point => point.identifier === start.id)
        const selection = window.getSelection()
        if (!end || Math.hypot(end.clientX - start.x, end.clientY - start.y) > 10 ||
          (selection && !selection.isCollapsed && selection.anchorNode && event.currentTarget.contains(selection.anchorNode))) return
        event.preventDefault()
        lastTouchClose.current = Date.now()
        onRequestClose()
      }}
      onClick={(event) => {
        if (closing || (event.detail > 0 && Date.now() - lastTouchClose.current < 800) || !(event.target instanceof Element) || event.target.closest('button, a, input, select, textarea')) return
        const selection = window.getSelection()
        if (selection && !selection.isCollapsed && selection.anchorNode && event.currentTarget.contains(selection.anchorNode)) return
        onRequestClose()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const elements = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')]
          .filter((element) => !element.closest('[inert]') && element.getClientRects().length > 0)
        const first = elements[0]
        const last = elements.at(-1)
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === 'gift-hide' && closing) onClosed()
      }}>
      <header className="gift-overlay-header"><button type="button" ref={backButton} onClick={onRequestClose} disabled={closing}><ArrowIcon back />返回三份禮物</button><span aria-hidden="true">♡</span></header>
      <section className="gift-detail-scroll" tabIndex={0} aria-label="禮物詳情內容">
        <article className={`gift-detail-content${gift.treats ? ' gift-detail-content--treats' : ''}`}>
          {!gift.treats && <div className="gift-detail-art"><span className="gift-art-halo" />{gift.artwork ? <BirthdayArtwork artwork={gift.artwork} /> : <GiftArtwork kind={gift.id} opened />}</div>}
          <div className="gift-detail-copy"><p className="gift-detail-label">{gift.label}</p><h2 id="gift-detail-title">{gift.detailTitle}</h2>
            {gift.announcementDate && <p className="gift-announcement"><time dateTime={gift.announcementDate}>{gift.announcementDate.replaceAll('-', ' / ')}</time><span>和妳見面</span></p>}
            <div className="gift-detail-paragraphs">{gift.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            {!gift.treats && <div className="gift-detail-end" aria-hidden="true"><span />♡<span /></div>}
          </div>
          {gift.treats && <div className="gift-treats">{gift.treats.map(treat => <figure className="gift-treat" key={treat.title}>
            <BirthdayArtwork artwork={treat.artwork} />
            <figcaption><h3>{treat.title}</h3><p>{treat.description}</p>{treat.appointment && <time dateTime={treat.appointment.dateTime}>{treat.appointment.label}</time>}</figcaption>
          </figure>)}</div>}
        </article>
      </section>
    </dialog>, document.body,
  )
}
