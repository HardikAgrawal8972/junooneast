const DEFAULT_SEEDS = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8']

// abstract "unexposed roll" cells: empty frames, edge print, and lens glyphs
const BLANK_CELLS = [
  { type: 'frame', label: '01' },
  { type: 'frame', label: '01A' },
  { type: 'text', label: 'JUNOON EAST · 35mm' },
  { type: 'frame', label: '02' },
  { type: 'aperture' },
  { type: 'frame', label: '02A' },
  { type: 'text', label: 'ISO 400 →' },
  { type: 'frame', label: '03' },
  { type: 'brackets' },
  { type: 'frame', label: '03A' },
  { type: 'text', label: '→ EXPOSE FOR THE SHADOWS' },
  { type: 'frame', label: '04' },
]

function ApertureGlyph() {
  return (
    <svg viewBox="0 0 100 100" className="film-glyph">
      <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M50 16 L64 50 M64 50 L30 36 M30 36 L68 36 M50 84 L36 50 M36 50 L70 64 M70 64 L32 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BracketsGlyph() {
  return (
    <svg viewBox="0 0 100 70" className="film-glyph wide">
      <path d="M14 8 H4 V20 M86 8 H96 V20 M14 62 H4 V50 M86 62 H96 V50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 27 V43 M42 35 H58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function BlankCell({ cell }) {
  if (cell.type === 'frame') {
    return (
      <div className="film-cell frame">
        <span>{cell.label}</span>
      </div>
    )
  }
  if (cell.type === 'text') {
    return <div className="film-cell text">{cell.label}</div>
  }
  return <div className="film-cell">{cell.type === 'aperture' ? <ApertureGlyph /> : <BracketsGlyph />}</div>
}

/**
 * Scrolling 35mm film-strip divider with sprocket holes.
 * `blank` renders an unexposed roll (no photos — empty frames, edge print,
 * lens glyphs); otherwise it shows photo frames from `seeds`.
 * `mono` renders photos black & white; `flat` removes the tilt.
 */
export default function FilmStrip({ blank = false, mono = false, flat = false, seeds = DEFAULT_SEEDS }) {
  const frames = seeds.map((seed) => `https://picsum.photos/seed/${seed}/300/200`)
  return (
    <div className={`filmstrip ${mono ? 'mono' : ''} ${flat ? 'flat' : ''}`} aria-hidden="true">
      <div className="film-sprockets" />
      <div className="film-track">
        {[0, 1].map((half) => (
          <div key={half} style={{ display: 'flex', gap: 10 }}>
            {blank
              ? [...BLANK_CELLS, ...BLANK_CELLS].map((cell, i) => <BlankCell key={`${half}-${i}`} cell={cell} />)
              : frames.map((src, i) => (
                  <img key={`${half}-${i}`} className="film-frame" src={src} alt="" loading="lazy" />
                ))}
          </div>
        ))}
      </div>
      <div className="film-sprockets" />
    </div>
  )
}
