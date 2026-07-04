import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import HeroBackground from './HeroBackground'

const letterVariants = {
  hidden: { y: '110%', rotate: 6 },
  visible: (i) => ({
    y: 0,
    rotate: 0,
    transition: { delay: 0.35 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

function TitleLine({ word, outline = false, offset = 0 }) {
  return (
    <span className={`line ${outline ? 'outline' : ''}`}>
      {word.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="ltr"
          custom={offset + i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

function StickyNote({ style, children, dragRef }) {
  return (
    <motion.div
      className="sticky-note"
      style={style}
      drag
      dragConstraints={dragRef}
      dragElastic={0.2}
      whileDrag={{ scale: 1.08, zIndex: 20 }}
      whileHover={{ scale: 1.04 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1, type: 'spring', stiffness: 200, damping: 16 }}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section id="home" className="hero" ref={heroRef}>
      <HeroBackground />
      <motion.svg
        className="doodle"
        style={{ top: 130, left: '6%', width: 70 }}
        viewBox="0 0 100 100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <path d="M10 80 Q40 10 90 40" stroke="#3A6FF7" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M78 30 L92 40 L80 52" stroke="#3A6FF7" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      <motion.svg
        className="doodle"
        style={{ top: 160, right: '8%', width: 60 }}
        viewBox="0 0 100 100"
        initial={{ opacity: 0, rotate: -60 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <circle cx="50" cy="50" r="30" stroke="#FF5470" strokeWidth="4" fill="none" strokeDasharray="6 8" />
      </motion.svg>

      <StickyNote dragRef={heroRef} style={{ top: '22%', left: '4%', rotate: -6 }}>
        shoot day: every friday, 6am, don't be late 📸
      </StickyNote>
      <StickyNote dragRef={heroRef} style={{ top: '20%', right: '4%', rotate: 5, background: 'var(--coral)', color: '#fff' }}>
        grain &gt; filters, always.
      </StickyNote>

      <motion.div style={{ y: titleY, opacity: fade }}>
        <motion.div
          className="hero-tag"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          est. campus east wing, forever caffeinated —
        </motion.div>
        <h1>
          <TitleLine word="JUNOON" />
          <TitleLine word="EAST" outline offset={6} />
        </h1>
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          we see the campus in exposures, not minutes.
        </motion.p>
        <motion.div
          className="cta-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <a className="btn" href="#gallery">
            View Gallery
          </a>
          <a className="btn alt" href="#spotlight">
            Meet the Lens
          </a>
        </motion.div>
      </motion.div>

      <div className="washi" style={{ bottom: '10%', left: '12%', transform: 'rotate(-20deg)' }} />
      <div className="washi" style={{ bottom: '14%', right: '14%', transform: 'rotate(15deg)' }} />

      <motion.div
        className="paint-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        this page is a long exposure — <br />
        move to paint with light, click for flash ✳
      </motion.div>

      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.8 }}
        style={{ opacity: fade }}
      >
        scroll
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
          <path d="M9 2v16M3 13l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  )
}
