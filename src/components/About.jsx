import { motion } from 'framer-motion'

import { useMotion } from '../context/motion.js'
import { profile } from '../data/profile.js'
import { useLocalTime } from '../hooks/useLocalTime.js'
import Journey from './Journey.jsx'
import GlassCard from './ui/GlassCard.jsx'
import ScrollLitText from './ui/ScrollLitText.jsx'
import { Section, SectionHeader } from './ui/Section.jsx'

const STATEMENT =
  'I build clean, responsive, user-centric web applications that bridge solid back-end logic with polished front-end interfaces.'

const CARD = 'rounded-[2rem] p-7 sm:p-8 md:p-10'

// The arc from Brazil (bottom left) to Spain (top right), in SVG units.
const ROUTE = { path: 'M24 190 C 110 30 280 6 376 70', from: [24, 190], to: [376, 70] }

function BackgroundCard({ className = '' }) {
  return (
    <GlassCard as="article" className={`${CARD} ${className}`}>
      <h3 className="text-lg font-medium text-zinc-50">Background</h3>
      <div className="mt-5 max-w-[38rem] space-y-5 text-base/7 text-pretty text-zinc-300 sm:text-lg/8">
        <p>
          I hold a degree in Systems Analysis &amp; Development and worked as an IT &amp; Front-End
          Specialist at the Secretaria da Mulher do Estado de Pernambuco, in Brazil.
        </p>
        <p>
          Today I live in Burgos, Spain, where I&rsquo;m specializing in Web Application Development
          (DAW). I prototype interfaces in Figma and build them with HTML, CSS and JavaScript,
          backed by Java, Python and PostgreSQL.
        </p>
      </div>
    </GlassCard>
  )
}

/** The move from Brazil to Spain, drawn as an arc the first time it scrolls into view. */
function RouteCard({ className = '' }) {
  const { enabled: motionEnabled } = useMotion()

  return (
    <GlassCard as="article" className={`flex flex-col ${CARD} ${className}`}>
      <h3 className="text-lg font-medium text-zinc-50">Brazil to Spain</h3>
      <p className="mt-2 text-pretty text-zinc-400">
        Originally from {profile.origin}, now based in Burgos, in northern Spain.
      </p>

      <div className="mt-auto pt-8">
        <svg viewBox="0 0 400 220" role="img" aria-label="An arc from Brazil to Spain" className="w-full">
          {/* Dotted guide, then the solid line that draws itself over it */}
          <path
            d={ROUTE.path}
            fill="none"
            stroke="rgb(255 255 255 / 0.18)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="1 8"
          />
          <motion.path
            d={ROUTE.path}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth="1.75"
            strokeLinecap="round"
            initial={motionEnabled ? { pathLength: 0 } : false}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
          />
          <circle cx={ROUTE.from[0]} cy={ROUTE.from[1]} r="5" fill="#09090b" stroke="#e4e4e7" strokeWidth="1.75" />
          <circle cx={ROUTE.to[0]} cy={ROUTE.to[1]} r="12" fill="rgb(6 182 212 / 0.18)" />
          <circle cx={ROUTE.to[0]} cy={ROUTE.to[1]} r="5" fill="#06b6d4" />
        </svg>
        <div className="mt-3 flex justify-between font-mono text-xs text-zinc-400">
          <span>Brazil</span>
          <span>Burgos, Spain</span>
        </div>
      </div>
    </GlassCard>
  )
}

/** What is happening now, with the live local time in Burgos. */
function NowCard({ className = '' }) {
  const time = useLocalTime(profile.timeZone)

  return (
    <GlassCard
      as="article"
      className={`flex flex-wrap content-between items-end justify-between gap-x-10 gap-y-8 ${CARD} ${className}`}
    >
      <div>
        <h3 className="flex items-center gap-3 text-lg font-medium text-zinc-50">
          <span aria-hidden="true" className="relative flex size-2.5">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-neon-cyan" />
            <span className="relative size-2.5 rounded-full bg-neon-cyan" />
          </span>
          Right now
        </h3>
        <p className="mt-2 max-w-sm text-pretty text-zinc-400">
          Specializing in Web Application Development (DAW) in Spain.
        </p>
      </div>

      <p className="shrink-0">
        <span className="block font-mono text-3xl tracking-tight text-zinc-50 tabular-nums">{time}</span>
        <span className="mt-1 block text-sm text-zinc-400">Local time in Burgos</span>
      </p>
    </GlassCard>
  )
}

export default function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <SectionHeader id="about-title" title="About & experience" />

      <ScrollLitText
        text={STATEMENT}
        className="mt-10 max-w-4xl text-[clamp(1.5rem,3.1vw,2.5rem)] leading-[1.22] font-medium tracking-[-0.02em] text-zinc-50"
      />

      {/* Bento grid. From `lg` up: background and "right now" on the left,
          the route card spanning both rows on the right, timeline below. */}
      <div className="mt-14 grid gap-4 md:grid-cols-12 md:mt-16">
        <BackgroundCard className="md:col-span-12 lg:col-span-7" />
        <RouteCard className="md:col-span-6 lg:col-span-5 lg:row-span-2" />
        <NowCard className="md:col-span-6 lg:col-span-7" />

        <GlassCard as="article" className={`md:col-span-12 ${CARD}`}>
          <h3 className="text-lg font-medium text-zinc-50">The path so far</h3>
          <div className="mt-8">
            <Journey />
          </div>
        </GlassCard>
      </div>
    </Section>
  )
}
