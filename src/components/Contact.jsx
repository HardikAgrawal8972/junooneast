import Reveal from './Reveal'

const CARDS = [
  { label: 'email', value: 'junoon.east@nsut.ac.in', href: 'mailto:junoon.east@nsut.ac.in' },
  { label: 'instagram', value: '@junoon.east', href: 'https://instagram.com/junoon.east', external: true },
  { label: 'facebook', value: '/junoon.east', href: 'https://facebook.com/junoon.east', external: true },
]

export default function Contact() {
  return (
    <section id="contact">
      <div className="section-inner">
        <Reveal>
          <div className="eyebrow">got questions?</div>
          <h2>Let's Talk</h2>
          <p className="sub">
            Slide into our DMs, drop an email, or just find us near the amphitheatre with a camera in hand.
          </p>
        </Reveal>
        <div className="contact-grid">
          {CARDS.map((card, i) => (
            <Reveal key={card.label} delay={0.12 * i} y={30}>
              <a
                className="contact-card"
                href={card.href}
                {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="label">{card.label}</span>
                <span className="value">{card.value}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
