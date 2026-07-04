import { useEffect, useRef } from 'react'

const BOKEH_COLORS = [
  [255, 210, 63], // yellow
  [255, 84, 112], // coral
  [92, 133, 247], // cobalt
  [242, 234, 216], // cream
]

const BOKEH_COUNT = 46
const TRAIL_LIFE = 1400 // ms a light-painting point stays visible
const REPEL_RADIUS = 150

/**
 * "Long exposure" hero background: parallax bokeh orbs that scatter away from
 * the cursor, a light-painting trail that follows it, and a camera flash +
 * spark burst on click. Pure canvas, pointer-events pass through.
 */
export default function HeroBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas.parentElement
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0
    let h = 0
    let raf = 0
    const mouse = { x: null, y: null, px: 0, py: 0 } // px/py = smoothed parallax offset
    const trail = []
    const sparks = []
    let flash = 0

    const rand = (a, b) => a + Math.random() * (b - a)

    const bokeh = Array.from({ length: BOKEH_COUNT }, () => ({
      x: 0,
      y: 0,
      z: rand(0.25, 1), // depth: far (small, slow) → near (big, fast)
      r: 0,
      color: BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)],
      vx: rand(-0.08, 0.08),
      vy: rand(-0.05, 0.05),
      phase: rand(0, Math.PI * 2),
      twinkle: rand(0.4, 1.2),
      ox: 0, // repulsion offset, springs back to 0
      oy: 0,
    }))

    const scatter = () => {
      bokeh.forEach((b) => {
        b.x = rand(0, w)
        b.y = rand(0, h)
        b.r = rand(3, 9) + b.z * 16
      })
    }

    const resize = () => {
      w = hero.clientWidth
      h = hero.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (bokeh[0].r === 0) scatter()
      bokeh.forEach((b) => {
        b.x = Math.min(b.x, w)
        b.y = Math.min(b.y, h)
      })
      if (reduced) drawStatic()
    }

    const drawOrb = (x, y, r, [cr, cg, cb], alpha) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`)
      g.addColorStop(0.55, `rgba(${cr},${cg},${cb},${alpha * 0.45})`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      bokeh.forEach((b) => drawOrb(b.x, b.y, b.r, b.color, 0.14 * b.z))
      ctx.globalCompositeOperation = 'source-over'
    }

    const frame = (now) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // smoothed parallax toward the cursor
      const tx = mouse.x === null ? 0 : (mouse.x - w / 2) / (w / 2)
      const ty = mouse.y === null ? 0 : (mouse.y - h / 2) / (h / 2)
      mouse.px += (tx - mouse.px) * 0.04
      mouse.py += (ty - mouse.py) * 0.04

      // --- bokeh field ---
      bokeh.forEach((b) => {
        b.x += b.vx * (0.4 + b.z)
        b.y += b.vy * (0.4 + b.z)
        b.phase += 0.01 * b.twinkle

        // wrap around edges (with margin so orbs fade in/out off-screen)
        const m = b.r * 2
        if (b.x < -m) b.x = w + m
        if (b.x > w + m) b.x = -m
        if (b.y < -m) b.y = h + m
        if (b.y > h + m) b.y = -m

        // repel from cursor, spring back when it leaves
        if (mouse.x !== null) {
          const dx = b.x + b.ox - mouse.x
          const dy = b.y + b.oy - mouse.y
          const d = Math.hypot(dx, dy)
          if (d < REPEL_RADIUS && d > 0.01) {
            const f = ((REPEL_RADIUS - d) / REPEL_RADIUS) * 3.2 * b.z
            b.ox += (dx / d) * f
            b.oy += (dy / d) * f
          }
        }
        b.ox *= 0.92
        b.oy *= 0.92

        const px = b.x + b.ox - mouse.px * 34 * b.z
        const py = b.y + b.oy - mouse.py * 22 * b.z
        const alpha = (0.1 + 0.1 * Math.sin(b.phase)) * (0.4 + 0.6 * b.z)
        drawOrb(px, py, b.r, b.color, Math.max(alpha, 0.03))
      })

      // --- light-painting trail ---
      while (trail.length && now - trail[0].t > TRAIL_LIFE) trail.shift()
      if (trail.length > 1) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1]
          const b = trail[i]
          const age = (now - b.t) / TRAIL_LIFE
          const alpha = Math.max(0, 1 - age)
          ctx.strokeStyle = `rgba(255,226,150,${alpha * 0.85})`
          ctx.lineWidth = 1 + alpha * 2.6
          ctx.shadowColor = 'rgba(255,210,63,0.9)'
          ctx.shadowBlur = 16 * alpha
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
        ctx.shadowBlur = 0
      }

      // --- flash sparks ---
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vx *= 0.96
        s.vy = s.vy * 0.96 + 0.05
        s.life -= 0.016
        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        drawOrb(s.x, s.y, s.r * s.life, s.color, s.life * 0.8)
      }

      ctx.globalCompositeOperation = 'source-over'

      // --- camera flash wash ---
      if (flash > 0.01) {
        ctx.fillStyle = `rgba(255,246,224,${flash})`
        ctx.fillRect(0, 0, w, h)
        flash *= 0.86
      }

      raf = requestAnimationFrame(frame)
    }

    const toLocal = (e) => {
      const r = hero.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onMove = (e) => {
      const p = toLocal(e)
      mouse.x = p.x
      mouse.y = p.y
      const last = trail[trail.length - 1]
      if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 3) {
        trail.push({ x: p.x, y: p.y, t: performance.now() })
        if (trail.length > 120) trail.shift()
      }
    }

    const onLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    const onDown = (e) => {
      // don't fire the flash when clicking buttons/links/notes
      if (e.target.closest('a, button, .sticky-note')) return
      const p = toLocal(e)
      flash = 0.45
      for (let i = 0; i < 26; i++) {
        const angle = rand(0, Math.PI * 2)
        const speed = rand(1.5, 7)
        sparks.push({
          x: p.x,
          y: p.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: rand(3, 8),
          life: rand(0.5, 1),
          color: BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)],
        })
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(hero)
    resize()

    if (!reduced) {
      hero.addEventListener('pointermove', onMove, { passive: true })
      hero.addEventListener('pointerleave', onLeave)
      hero.addEventListener('pointerdown', onDown)
      raf = requestAnimationFrame(frame)
    }

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      hero.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return <canvas className="hero-bg" ref={canvasRef} aria-hidden="true" />
}
