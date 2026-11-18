import { stack } from '../data/stack.js'
import { Section, SectionHeader } from './ui/Section.jsx'
import Tilt from './ui/Tilt.jsx'

// Accent per layer: cyan for the interface, violet for the logic underneath.
const TONES = {
  interface: { dot: 'bg-neon-cyan', symbol: 'text-cyan-300', spot: 'rgb(6 182 212)' },
  logic: { dot: 'bg-neon-violet', symbol: 'text-violet-300', spot: 'rgb(139 92 246)' },
}

/** A glass badge that tilts toward the pointer. On hover its content lifts off the glass. */
function TechBadge({ item, tone }) {
  return (
    <Tilt max={12} className="h-full" style={{ '--spot-color': tone.spot, '--spot-size': '14rem' }}>
      <div className="glass absolute inset-0 rounded-3xl" />
      <div className="glare absolute inset-0 rounded-3xl" />

      <div className="lift relative flex h-full flex-col p-5 sm:p-6" style={{ '--lift': '32px' }}>
        <span
          aria-hidden="true"
          className={`font-mono text-[1.75rem] leading-none font-medium tracking-tight ${tone.symbol}`}
        >
          {item.symbol}
        </span>
        <h4 className="mt-9 font-medium text-zinc-50">{item.name}</h4>
        <p className="mt-1 text-sm/5 text-zinc-400">{item.note}</p>
      </div>
    </Tilt>
  )
}

export default function TechStack() {
  return (
    <Section id="stack" labelledBy="stack-title">
      <SectionHeader
        id="stack-title"
        title="Tech stack"
        lead="A focused toolkit that covers the whole path, from the database to the interface."
      />

      <div className="mt-16 space-y-14">
        {stack.map((group) => {
          const tone = TONES[group.layer]
          return (
            <div key={group.layer} className="grid gap-6 lg:grid-cols-[13rem_1fr] lg:gap-10">
              <div>
                <h3 className="flex items-center gap-3 text-lg font-medium text-zinc-50">
                  <span aria-hidden="true" className={`size-2 rounded-full ${tone.dot}`} />
                  {group.title}
                </h3>
                <p className="mt-2 text-zinc-400">{group.summary}</p>
              </div>

              <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <TechBadge item={item} tone={tone} />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
