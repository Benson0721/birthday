import { letter } from '../content/letter'
import { StationeryAnimal } from './Artwork'

// A deliberately small safe subset: **emphasis** and literal newlines.
function LetterParagraph({ text }: { text: string }) {
  return <p>{text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : part)}</p>
}

export function LetterFront() {
  return (
    <>
      <header className="letter-heading">
        <StationeryAnimal kind="duck" className="letter-duck" />
        <p className="stationery-caption">把今天，留給完美的呱呱</p>
        <h1 id="letter-title" tabIndex={-1}>{letter.title}</h1>
        <div className="letter-rule" aria-hidden="true"><span>♡</span></div>
      </header>
      <section className="paper-scroll letter-scroll" data-scroll-face="front" tabIndex={0} aria-label="生日信內容">
        <div className="letter-paragraphs" data-letter-paragraphs>
          {letter.paragraphs.map((paragraph, index) => <LetterParagraph key={index} text={paragraph} />)}
        </div>
      </section>
      <div className="letter-closing">
        <StationeryAnimal kind="friends" className="letter-friends" />
        <p className="letter-signature">{letter.signature}</p>
      </div>
    </>
  )
}
