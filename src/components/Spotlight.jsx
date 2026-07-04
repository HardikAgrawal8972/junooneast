import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Reveal from './Reveal'

// shown until the API responds (and kept if it never does, e.g. static hosting)
const DEFAULTS = {
  photo: {
    image: 'https://picsum.photos/seed/photojune/1000/700',
    title: '"Steps, 5:47pm"',
    caption: 'shot on the library staircase, one take, no edits.',
    handle: 'ritika.frames',
  },
  photographer: {
    name: 'Ritika Sengar',
    avatar: 'https://picsum.photos/seed/photographerjune/300/300',
    role: 'shoots streets, sometimes strangers, always in manual.',
    handle: 'ritika.frames',
    notes: [
      'carries: canon AE-1, three rolls, zero patience',
      'this month: 14 frames published, 2 lectures skipped',
      'famous for: printing at 2am before every exhibit',
    ],
  },
}

function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 260, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 260, damping: 20 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    mx.set(x)
    my.set(y)
    ref.current.style.setProperty('--mx', `${x * 100}%`)
    ref.current.style.setProperty('--my', `${y * 100}%`)
  }

  const onLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={`profile-card ${className}`}
      style={{ rotateX, rotateY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

export default function Spotlight() {
  const [data, setData] = useState(DEFAULTS)

  useEffect(() => {
    fetch('/api/spotlight')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.photo && d?.photographer) {
          setData({
            photo: { ...DEFAULTS.photo, ...d.photo },
            photographer: { ...DEFAULTS.photographer, ...d.photographer },
          })
        }
      })
      .catch(() => {}) // keep defaults on static hosting / API down
  }, [])

  const { photo, photographer } = data

  return (
    <section id="spotlight">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">this month's frame</div>
            <h2>Spotlight</h2>
          </div>
        </Reveal>
        <div className="spot-grid">
          {/* Photo of the Month — the hero of this section */}
          <Reveal y={60}>
            <TiltCard className="photo-card">
              <span className="badge" style={{ background: 'var(--cobalt)' }}>
                Photo of the Month
              </span>
              <div className="pc-photo wide">
                <img src={photo.image} alt="Photo of the month" loading="lazy" />
              </div>
              <div className="photo-card-foot">
                <div>
                  <h3>{photo.title}</h3>
                  <p className="role">{photo.caption}</p>
                </div>
                <span className="handle">{photo.handle}</span>
              </div>
            </TiltCard>
          </Reveal>

          {/* Photographer of the Month — compact companion card */}
          <Reveal delay={0.15} y={60}>
            <div className="profile-card photog-card">
              <span className="badge">Photographer of the Month</span>
              <div className="photog-head">
                <div className="avatar">
                  <img src={photographer.avatar} alt="Photographer of the month portrait" loading="lazy" />
                </div>
                <div>
                  <h3>{photographer.name}</h3>
                  <span className="handle">{photographer.handle}</span>
                </div>
              </div>
              <p className="role">{photographer.role}</p>
              <ul className="photog-notes">
                {photographer.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
