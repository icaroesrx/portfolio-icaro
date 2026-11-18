import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { usePointer } from '../../hooks/usePointer.js'
import { CAMERA, getLayout, SIDE_BY_SIDE_QUERY } from './config.js'
import Knot from './Knot.jsx'
import Lighting from './Lighting.jsx'
import Particles from './Particles.jsx'

const { damp } = THREE.MathUtils

/**
 * Everything inside the canvas.
 *
 * `scroll` is a Framer Motion value from 0 to 1: how far the hero has been
 * scrolled out of view. `onFirstFrame` fires once the scene has been drawn.
 */
export default function Scene({ scroll, onFirstFrame }) {
  const pointer = usePointer()
  const size = useThree((state) => state.size)
  const sideBySide = useMediaQuery(SIDE_BY_SIDE_QUERY)
  const layout = useMemo(
    () =>
      getLayout({
        width: size.width,
        height: size.height,
        viewportHeight: window.innerHeight,
        sideBySide,
      }),
    [size.width, size.height, sideBySide],
  )

  // One smoothed copy of every input, shared by everything in the scene.
  const input = useRef({
    dt: 0, // seconds since the previous frame
    time: 0, // seconds of animation so far
    scroll: 0,
    x: 0, // pointer in the window, -1 to 1
    y: 0,
    canvasX: 0, // pointer relative to the canvas, -1 to 1
    canvasY: 0,
    strength: 0, // 1 while a pointer is active
  })
  const hasDrawn = useRef(false)

  // Priority -1: runs before the other frame callbacks, so they all read
  // values from the current frame.
  useFrame((state, delta) => {
    const now = input.current
    const raw = pointer.current
    const dt = Math.min(delta, 0.1) // a background tab must not cause a jump

    now.dt = dt
    now.time += dt
    now.scroll = damp(now.scroll, scroll.get(), 5, dt)
    now.x = damp(now.x, raw.x, 3.5, dt)
    now.y = damp(now.y, raw.y, 3.5, dt)
    now.strength = damp(now.strength, raw.strength, 3, dt)

    // The canvas scrolls with the page, so effects that must line up with the
    // cursor need its position relative to the canvas, not the window.
    const rect = state.gl.domElement.getBoundingClientRect()
    const canvasX = ((raw.clientX - rect.left) / rect.width) * 2 - 1
    const canvasY = -((raw.clientY - rect.top) / rect.height) * 2 + 1
    now.canvasX = damp(now.canvasX, canvasX, 9, dt)
    now.canvasY = damp(now.canvasY, canvasY, 9, dt)

    // Camera: drifts with the pointer for parallax and pulls back on scroll.
    state.camera.position.set(now.x * 0.6, now.y * 0.35, CAMERA.z + now.scroll * 3)
    state.camera.lookAt(0, 0, 0)

    if (!hasDrawn.current) {
      hasDrawn.current = true
      onFirstFrame?.()
    }
  }, -1)

  return (
    <>
      <Lighting />
      <Knot input={input} layout={layout} />
      <Particles input={input} count={layout.particles} stacked={layout.stacked} />
    </>
  )
}
