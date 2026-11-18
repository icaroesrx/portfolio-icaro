import { useEffect, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

import { useMotion } from '../../context/motion.js'

const SPRING = { stiffness: 170, damping: 18, mass: 0.6 }

/**
 * 3D tilt that follows the pointer.
 *
 * The outer element stays still: it sets the perspective and listens for the
 * pointer, so the card never tilts out from under the cursor and flickers.
 * The inner element is the one that rotates.
 *
 * Children are rendered inside a preserve-3d context. Give a child the
 * `lift` class (and a `--lift` distance) to raise it off the card's surface
 * while the card is hovered.
 *
 * The pointer position is also written to two CSS variables, --spot-x and
 * --spot-y, which the `.glass` border glow and the `.glare` layer read.
 * All three classes live in index.css.
 *
 * Tilt runs for mouse and pen only. Touch input gets a static card, and so
 * does everyone while the site's motion is switched off.
 */
export default function Tilt({ max = 8, className = '', innerClassName = '', style, children }) {
  const outer = useRef(null)
  const { enabled: motionEnabled } = useMotion()
  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)

  // If motion is switched off while a card is tilted, lay it flat again.
  useEffect(() => {
    if (motionEnabled) return
    rotateX.set(0)
    rotateY.set(0)
  }, [motionEnabled, rotateX, rotateY])

  const handleMove = (event) => {
    const element = outer.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width // 0 at the left edge, 1 at the right
    const y = (event.clientY - rect.top) / rect.height // 0 at the top, 1 at the bottom

    element.style.setProperty('--spot-x', `${(x * 100).toFixed(1)}%`)
    element.style.setProperty('--spot-y', `${(y * 100).toFixed(1)}%`)

    if (!motionEnabled || event.pointerType === 'touch') return
    rotateX.set((0.5 - y) * 2 * max)
    rotateY.set((x - 0.5) * 2 * max)
  }

  const handleLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div
      ref={outer}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ perspective: '1100px', ...style }}
      className={`spotlight ${className}`}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative h-full ${innerClassName}`}
      >
        {children}
      </motion.div>
    </div>
  )
}
