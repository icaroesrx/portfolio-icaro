import { useEffect, useRef } from 'react'

/**
 * Tracks the pointer across the whole window, no matter which element is
 * under it. The 3D scene sits behind the page content, so it cannot rely on
 * pointer events reaching the canvas.
 *
 * Returns a ref (reading it never re-renders) holding:
 *   clientX, clientY  position in CSS pixels
 *   x, y              position from -1 to 1, with y pointing up
 *   strength          1 while a pointer is active, 0 once it leaves the
 *                     window or a touch ends
 */
export function usePointer() {
  const pointer = useRef({ clientX: 0, clientY: 0, x: 0, y: 0, strength: 0 })

  useEffect(() => {
    const state = pointer.current

    const track = (event) => {
      state.clientX = event.clientX
      state.clientY = event.clientY
      state.x = (event.clientX / window.innerWidth) * 2 - 1
      state.y = -(event.clientY / window.innerHeight) * 2 + 1
      state.strength = 1
    }
    const release = (event) => {
      // A mouse keeps hovering after a click; a finger or pen is gone.
      if (event.pointerType !== 'mouse') state.strength = 0
    }
    const leave = () => {
      state.strength = 0
    }

    const passive = { passive: true }
    window.addEventListener('pointermove', track, passive)
    window.addEventListener('pointerdown', track, passive)
    window.addEventListener('pointerup', release, passive)
    window.addEventListener('pointercancel', release, passive)
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)

    return () => {
      window.removeEventListener('pointermove', track)
      window.removeEventListener('pointerdown', track)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
    }
  }, [])

  return pointer
}
