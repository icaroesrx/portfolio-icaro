// Shared settings for the hero scene.

export const CAMERA = { fov: 40, z: 7 }

export const CYAN = '#06b6d4'
export const VIOLET = '#8b5cf6'

/**
 * When the hero shows the copy and the knot side by side instead of stacked:
 * on screens from 1024px wide, and on landscape screens from 640px wide.
 * Keep this in step with the `side` variant defined in src/index.css.
 */
export const SIDE_BY_SIDE_QUERY = '(min-width: 64rem), (min-width: 40rem) and (orientation: landscape)'

// The knot's full width in world units at scale 1: curve radius 1.5 plus tube
// radius 0.34, doubled.
const KNOT_DIAMETER = 3.68

/**
 * Where the knot sits, how big it is, and how dense the particle field is.
 *
 *   width, height    Canvas size in CSS pixels. The canvas fills the hero.
 *   viewportHeight   Window height in CSS pixels. On small screens the hero
 *                    can be taller than the window.
 *   sideBySide       Result of SIDE_BY_SIDE_QUERY.
 *
 * The placement is worked out in CSS pixels from the top-left corner of the
 * canvas, then converted to world units.
 */
export function getLayout({ width, height, viewportHeight, sideBySide }) {
  // World units visible from top to bottom at the knot's depth (z = 0).
  const worldHeight = 2 * Math.tan((CAMERA.fov * Math.PI) / 360) * CAMERA.z
  const pixelsPerUnit = height / worldHeight
  // The part of the hero that is on screen when the page loads.
  const screenHeight = Math.min(height, viewportHeight)

  let diameter
  let centerX
  let centerY

  if (sideBySide) {
    // The centerpiece of the right half, clear of the copy on the left.
    diameter = Math.min(screenHeight * 0.72, width * 0.43)
    centerX = width * 0.74
    centerY = screenHeight / 2
  } else {
    // Hangs just below the navigation bar, above the headline. Hero.jsx
    // reserves the matching space above the copy with its top padding.
    diameter = Math.min(width * 0.767, screenHeight * 0.42)
    centerX = width / 2
    centerY = 80 + diameter / 2
  }

  let particles = 3200
  if (width < 1280) particles = 1800
  if (width < 640) particles = 900

  return {
    stacked: !sideBySide,
    scale: diameter / pixelsPerUnit / KNOT_DIAMETER,
    x: (centerX - width / 2) / pixelsPerUnit,
    y: (height / 2 - centerY) / pixelsPerUnit,
    particles,
  }
}
