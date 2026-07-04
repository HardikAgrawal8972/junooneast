import { useEffect, useRef } from 'react'

/** Soft torch-light that follows the cursor across the dark page. */
export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    let raf = 0
    const onMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--cx', `${e.clientX}px`)
        el.style.setProperty('--cy', `${e.clientY}px`)
        raf = 0
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />
}
