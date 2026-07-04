import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal'

const PHOTOS = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'].map((seed, i) => ({
  seed,
  src: `https://picsum.photos/seed/${seed}/440/600`,
  caption: `frame ${String(i + 1).padStart(2, '0')} — shot by us`,
}))

const RADIUS = 380
const AUTO_SPEED = 0.06

export default function Gallery() {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const [selected, setSelected] = useState(null)

  // Rotation lives in refs and is applied via rAF so drag stays at 60fps
  // without triggering React re-renders.
  const state = useRef({
    rotation: 0,
    velocity: 0,
    dragging: false,
    startX: 0,
    startRotation: 0,
    lastX: 0,
    moved: false,
    autoSpin: true,
  })

  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const s = state.current
    let raf

    const apply = () => {
      stage.style.transform = `rotateX(-6deg) rotateY(${s.rotation}deg)`
    }

    const loop = () => {
      if (!s.dragging) {
        if (Math.abs(s.velocity) > 0.02) {
          // glide with inertia after a fling, decaying toward auto-spin speed
          s.rotation += s.velocity
          s.velocity *= 0.95
        } else if (s.autoSpin) {
          s.rotation += AUTO_SPEED
        }
        apply()
      }
      raf = requestAnimationFrame(loop)
    }

    const onDown = (e) => {
      s.dragging = true
      s.moved = false
      s.autoSpin = false
      s.velocity = 0
      s.startX = e.clientX
      s.lastX = e.clientX
      s.startRotation = s.rotation
      wrap.setPointerCapture(e.pointerId)
    }
    const onMove = (e) => {
      if (!s.dragging) return
      const dx = e.clientX - s.startX
      if (Math.abs(dx) > 4) s.moved = true
      s.velocity = (e.clientX - s.lastX) * 0.35
      s.lastX = e.clientX
      s.rotation = s.startRotation + dx * 0.35
      apply()
    }
    const onUp = () => {
      s.dragging = false
      // resume the idle spin once the fling settles
      setTimeout(() => {
        s.autoSpin = true
      }, 2500)
    }

    wrap.addEventListener('pointerdown', onDown)
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerup', onUp)
    wrap.addEventListener('pointerleave', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      wrap.removeEventListener('pointerdown', onDown)
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerup', onUp)
      wrap.removeEventListener('pointerleave', onUp)
    }
  }, [])

  useEffect(() => {
    if (!selected) return
    const onKey = (e) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <section id="gallery">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">member gallery</div>
            <h2>Shot By Us</h2>
            <p className="hint">drag to spin the reel — click a frame to zoom →</p>
          </div>
        </Reveal>
        <div className="dome-wrap" ref={wrapRef}>
          <div className="dome-stage" ref={stageRef}>
            {PHOTOS.map((photo, i) => (
              <div
                key={photo.seed}
                className="dome-item"
                style={{ transform: `rotateY(${(360 / PHOTOS.length) * i}deg) translateZ(${RADIUS}px)` }}
                onClick={() => {
                  if (!state.current.moved) setSelected(photo)
                }}
              >
                <img src={photo.src} alt={`Member photograph ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.figure
              className="polaroid"
              initial={{ scale: 0.7, rotate: -6, y: 40 }}
              animate={{ scale: 1, rotate: -2, y: 0 }}
              exit={{ scale: 0.7, rotate: 6, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected.src.replace('/440/600', '/880/1200')} alt={selected.caption} />
              <figcaption>{selected.caption}</figcaption>
            </motion.figure>
            <button className="lightbox-close" aria-label="Close" onClick={() => setSelected(null)}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
