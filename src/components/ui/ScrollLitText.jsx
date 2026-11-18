import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.22, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

/**
 * A paragraph whose words light up one after another as it scrolls into
 * view. The reveal is tied to the scroll position, so it moves at exactly the
 * visitor's pace and runs backwards when they scroll up.
 */
export default function ScrollLitText({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    // From "top of the text enters the lower part of the screen"
    // to "top of the text reaches the upper third".
    offset: ['start 0.9', 'start 0.3'],
  })

  const words = text.split(' ')

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => {
        // Each word fades in over a short window; windows overlap slightly.
        const start = index / words.length
        const end = Math.min(1, start + 2 / words.length)
        return (
          <Word key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
            {index < words.length - 1 ? `${word} ` : word}
          </Word>
        )
      })}
    </p>
  )
}
