import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

import { journey } from '../data/journey.js'

function Stop({ stop, at, progress }) {
  // The node lights up as the line reaches it.
  const lit = useTransform(progress, [Math.max(0, at - 0.04), at + 0.02], [0, 1])

  return (
    <li className="relative pl-9 lg:pt-10 lg:pl-0">
      <span
        aria-hidden="true"
        className="absolute top-1 left-0 grid size-[15px] place-items-center rounded-full border border-white/25 bg-obsidian lg:top-0"
      >
        <motion.span
          style={{ opacity: lit }}
          className="size-[7px] rounded-full bg-neon-cyan shadow-[0_0_12px_2px_rgb(6_182_212/0.8)]"
        />
      </span>

      <p className="font-mono text-xs text-zinc-400">{stop.place}</p>
      <h4 className="mt-2 font-medium text-balance text-zinc-50">{stop.title}</h4>
      {stop.org && <p className="mt-1 text-sm text-zinc-300">{stop.org}</p>}
      <p className="mt-2 text-sm/6 text-pretty text-zinc-400">{stop.detail}</p>
      {stop.current && (
        <p className="mt-4 inline-flex rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 font-mono text-xs text-cyan-200">
          In progress
        </p>
      )}
    </li>
  )
}

/**
 * Timeline of the path from Brazil to Spain.
 *
 * A line runs through the stops and fills as the visitor scrolls: top to
 * bottom on small screens, left to right from the `lg` breakpoint up.
 */
export default function Journey() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <div ref={ref} className="relative">
      {/* Rail */}
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[7px] w-px bg-white/10 lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
      />
      {/* Fill: one element per orientation, both driven by the same value */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY: progress }}
        className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-neon-cyan lg:hidden"
      />
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute top-[7px] right-0 left-0 h-px origin-left bg-neon-cyan max-lg:hidden"
      />

      <ol className="relative grid gap-9 lg:grid-cols-4 lg:gap-8">
        {journey.map((stop, index) => (
          <Stop key={stop.title} stop={stop} at={index / journey.length} progress={progress} />
        ))}
      </ol>
    </div>
  )
}
