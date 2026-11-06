import { canOpenGift, gifts, type Gift, type GiftId } from '../content/gifts'
import { useTouchButton } from '../app/useTouchButton'
import { GiftArtwork, StationeryAnimal } from './Artwork'

type Props = {
  openedGiftIds: GiftId[]
  onOpenGift: (id: GiftId, trigger: HTMLButtonElement) => void
}

function GiftButton({ gift, opened, locked, step, onOpenGift }: { gift: Gift; opened: boolean; locked: boolean; step: number; onOpenGift: Props['onOpenGift'] }) {
  const interaction = useTouchButton(button => onOpenGift(gift.id, button))
  return <button type="button" className="gift-row" data-gift={gift.id} data-opened={opened} disabled={locked}
    aria-label={`${gift.label}，${locked ? `請先拆完${gifts[step - 2]?.label}` : opened ? '再看一次' : '點擊拆開'}`} aria-haspopup="dialog" {...interaction}>
    <span className="gift-step" aria-hidden="true" data-step={opened ? '✓' : step} />
    <GiftArtwork kind={gift.id} opened={opened} />
    {locked && <svg className="gift-lock" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="4.5" y="8.5" width="11" height="8" rx="2" /><path d="M7 8V5.5a3 3 0 0 1 6 0V8m-3 4v1.5" /></svg>}
  </button>
}

export function GiftBack({ openedGiftIds, onOpenGift }: Props) {
  const nextGift = gifts.find(gift => !openedGiftIds.includes(gift.id))
  return (
    <>
      <header className="gifts-heading">
        <StationeryAnimal kind="expectant-duck" className="gifts-duck" />
        <h2 id="gifts-title">這全部都是妳的大禮物</h2>
        <p>要照順序開不要爆呱呱雷!</p>
        <p className="gift-order" aria-label="拆封順序"><span>吃得爽快</span><span aria-hidden="true">→</span><span>玩得開心</span><span aria-hidden="true">→</span><span>神祕小禮</span></p>
      </header>
      <section className="paper-scroll gift-scroll" data-scroll-face="back" tabIndex={0} aria-label="三份禮物清單">
        <div className="gift-list">
          {gifts.map((gift, index) => <GiftButton key={gift.id} gift={gift} step={index + 1} opened={openedGiftIds.includes(gift.id)} locked={!canOpenGift(gift.id, openedGiftIds)} onOpenGift={onOpenGift} />)}
        </div>
      </section>
      <div className="gifts-closing"><p className="gifts-footnote" aria-live="polite">{nextGift ? `下一份：${nextGift.label}` : '三份心意，都送到妳手裡了，請摸摸呱呱'}</p></div>
    </>
  )
}
