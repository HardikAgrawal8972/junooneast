import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

/** Counts from 0 up to `end` once visible. */
function CountUp({ end, suffix = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    let raf
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1400
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(end * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [end])

  return (
    <b ref={ref}>
      {value}
      {suffix}
    </b>
  )
}

const STATS = [
  { end: 120, suffix: '+', label: 'Members' },
  { end: 40, suffix: '+', label: 'Photowalks' },
  { end: 15, suffix: '', label: 'Workshops' },
]

export default function About() {
  return (
    <section id="about">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">who we are</div>
            <h2>The Faces Behind The Frames</h2>
          </div>
        </Reveal>
        <div className="about-grid">
          <div>
            <p className="about-text">
              Junoon East started as a dorm-room dare — borrow a camera, skip a lecture, come back
              with a frame worth keeping. Today we're the lens through which East Campus tells its
              own stories: <strong>6am photowalks</strong>, darkroom arguments about grain, and a
              group chat that never sleeps. We shoot people, protests, potholes, and the particular
              gold light that hits the library steps at <strong>5:47pm</strong>. If you've ever
              stopped mid-walk because the light looked right, you already speak our language.
            </p>
            <div className="stats-row">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={0.15 * i} y={24} rotate={i % 2 ? 3 : -3}>
                  <div className="stat">
                    <CountUp end={s.end} suffix={s.suffix} />
                    <span>{s.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="about-side">
            <Reveal delay={0.2} y={50} rotate={8}>
              <figure className="polaroid">
                <img src="https://picsum.photos/seed/junoonabout/500/620" alt="Member shooting on a photowalk" loading="lazy" />
                <figcaption>photowalk, east gate — 6:04am</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        {/* Full-width group photo — swap the placeholder img for the real crew shot */}
        <Reveal delay={0.1} y={50}>
          <figure className="group-frame">
            <span className="tape tl" aria-hidden="true" />
            <span className="tape tr" aria-hidden="true" />
            <img src="https://picsum.photos/seed/junooncrew/1400/640" alt="Junoon East group photo" loading="lazy" />
            <figcaption>
              the whole circus, monsoon frames '25 <span className="note">— real group photo goes here, once everyone shows up at once</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
