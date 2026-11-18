import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

import { CAMERA } from './config.js'
import Scene from './Scene.jsx'

const WARM_UP_SECONDS = 2 // ignore start-up, when shaders are still compiling

/**
 * Watches the frame rate. Each time it stays below `minFps` for `seconds`
 * seconds in a row, it calls `onSlow`, then starts counting again.
 */
function FrameRateGuard({ minFps, seconds, onSlow }) {
  const sample = useRef({ warmUp: WARM_UP_SECONDS, frames: 0, elapsed: 0, slowSeconds: 0 })

  useFrame((_, delta) => {
    const s = sample.current

    if (s.warmUp > 0) {
      s.warmUp -= delta
      return
    }

    s.frames += 1
    s.elapsed += delta
    if (s.elapsed < 1) return

    const fps = s.frames / s.elapsed
    s.frames = 0
    s.elapsed = 0
    s.slowSeconds = fps < minFps ? s.slowSeconds + 1 : 0

    if (s.slowSeconds >= seconds) {
      s.slowSeconds = 0
      onSlow()
    }
  })

  return null
}

/**
 * The WebGL canvas behind the hero.
 *
 * This file is loaded lazily (see Hero.jsx), so three.js stays out of the
 * initial bundle and the page text appears first.
 *
 *   scroll     Framer Motion value, 0 to 1: how far the hero has scrolled away.
 *   offscreen  True while the hero is out of view. Rendering stops entirely.
 *   playing    False while the animation is paused (see MotionProvider.jsx).
 *              The scene then holds its last frame instead of animating.
 *   onSlow     Called when the scene cannot keep up even at low resolution.
 *              MotionProvider answers by pausing it.
 *   onReady    Called after the first frame, so the canvas can fade in.
 *
 * On hardware that struggles, quality steps down by itself:
 *   1. below 45 fps for 3 seconds: render at 1x pixel density instead of 1.5x
 *   2. still below 20 fps for 5 seconds: report it through `onSlow`
 */
export default function HeroCanvas({ scroll, offscreen, playing, onSlow, onReady }) {
  const [lowResolution, setLowResolution] = useState(false)

  // Beyond 1.5x the extra pixels cost more than they show.
  const dpr = lowResolution ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)

  let frameloop = 'always'
  if (!playing) frameloop = 'demand' // draws only when something changes, e.g. a resize
  if (offscreen) frameloop = 'never'

  return (
    <Canvas
      dpr={dpr}
      frameloop={frameloop}
      camera={{ fov: CAMERA.fov, position: [0, 0, CAMERA.z], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true }}
      resize={{ scroll: false }}
    >
      {playing && !lowResolution && (
        <FrameRateGuard key="resolution" minFps={45} seconds={3} onSlow={() => setLowResolution(true)} />
      )}
      {playing && lowResolution && <FrameRateGuard key="pause" minFps={20} seconds={5} onSlow={onSlow} />}
      <Scene scroll={scroll} onFirstFrame={onReady} />
    </Canvas>
  )
}
