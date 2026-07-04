import Reveal from './Reveal'

const EVENTS = [
  {
    date: 'Jul 18 · 5:30am',
    title: 'Golden Hour Walk',
    desc: 'Sunrise photowalk from east gate to the old observatory. Film shooters get first pick of the loaner bodies.',
    meta: 'meet: east gate, bring chai money',
  },
  {
    date: 'Aug 02 · 4:00pm',
    title: 'Darkroom 101',
    desc: 'Develop and print your first roll. Chemicals, paper, and patient seniors provided. Twelve seats, no phones.',
    meta: 'basement lab, block C',
  },
  {
    date: 'Aug 23 · 6:00pm',
    title: 'Monsoon Frames',
    desc: 'Our themed contest and open exhibition night. One photo per member, printed A3, argued over loudly.',
    meta: 'amphitheatre lawns, rain or shine',
  },
]

export default function Events() {
  return (
    <section id="events">
      <div className="section-inner">
        <Reveal>
          <div className="section-head">
            <div className="eyebrow">mark your calendars</div>
            <h2>What's Next</h2>
          </div>
        </Reveal>
        <div className="events-list">
          <div className="timeline-line" aria-hidden="true" />
          {EVENTS.map((ev, i) => (
            <Reveal key={ev.title} delay={0.12 * i} y={40} rotate={i % 2 ? 1.5 : -1.5}>
              <article className="event-card">
                <span className="tape" aria-hidden="true" />
                <span className="event-date">{ev.date}</span>
                <h3>{ev.title}</h3>
                <p>{ev.desc}</p>
                <span className="meta">{ev.meta}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
