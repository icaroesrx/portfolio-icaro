import { createContext, useContext } from 'react'

/**
 * The site's motion setting, provided by components/MotionProvider.jsx.
 *
 *   enabled            True when motion is on for the whole site: the 3D
 *                      scene, tilt, parallax and entrance animations.
 *   scenePlaying       True while the 3D hero is animating. False when motion
 *                      is off, and when the scene paused itself because the
 *                      device could not keep up.
 *   pausedBy           Why the scene is still: 'system' (the visitor's system
 *                      asks for reduced motion), 'visitor' (they pressed
 *                      pause), 'performance', or null while it is playing.
 *   toggle()           Play or pause. Used by the button in the hero.
 *   reportSlowScene()  Called by the 3D scene when its frame rate stays very low.
 */
export const MotionContext = createContext(null)

export function useMotion() {
  const value = useContext(MotionContext)
  if (!value) throw new Error('useMotion must be used inside <MotionProvider>.')
  return value
}
