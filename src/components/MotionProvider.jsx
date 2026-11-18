import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { MotionConfig } from 'framer-motion'

import { MotionContext } from '../context/motion.js'
import { motionSettings } from '../data/motion.js'

const STORAGE_KEY = 'motion' // remembers a visitor's own choice: 'on' or 'off'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// Printed in the browser console during development, so a still scene is
// never a mystery.
const DEV_HINTS = {
  system:
    '[motion] Paused: this system asks for reduced motion and respectSystemSetting is on in src/data/motion.js. Press "Play animation" in the hero to animate anyway; the choice is remembered.',
  performance:
    '[motion] The 3D scene paused itself: the frame rate stayed below 20 fps (pauseWhenSlow in src/data/motion.js). Press "Play animation" in the hero to run it anyway.',
  visitor: '[motion] Paused with the button in the hero.',
}

let lastHint = null // so React's development double-run prints each hint once

function printDevHint(pausedBy) {
  if (!import.meta.env.DEV || pausedBy === lastHint) return
  lastHint = pausedBy
  if (pausedBy) console.info(DEV_HINTS[pausedBy])
}

function readSavedChoice() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'on' || saved === 'off' ? saved : null
  } catch {
    return null // storage can be unavailable (private mode, embedded pages)
  }
}

function saveChoice(choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // Not being able to remember the choice is fine.
  }
}

/** True when the visitor's system asks for reduced motion and the site is set to listen. */
function systemAsksForLessMotion() {
  return motionSettings.respectSystemSetting && window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getInitialState() {
  const saved = readSavedChoice()
  return {
    // A choice the visitor made earlier wins. Otherwise the site's default applies.
    enabled: saved ? saved === 'on' : !systemAsksForLessMotion(),
    chosenBy: saved ? 'visitor' : 'default',
    scenePaused: false, // the 3D scene paused itself to protect the frame rate
    autoPause: motionSettings.pauseWhenSlow, // whether it is allowed to do that
  }
}

/**
 * Owns the site's motion setting and shares it through useMotion().
 *
 * Motion starts on. The two exceptions are switches in src/data/motion.js:
 * starting paused when the visitor's system asks for reduced motion, and
 * pausing the 3D scene on devices that cannot keep up. Either way the
 * play/pause button in the hero has the last word, and that choice is
 * remembered in the browser for the next visit.
 */
export default function MotionProvider({ children }) {
  const [state, setState] = useState(getInitialState)

  const toggle = useCallback(() => {
    setState((current) => {
      const playing = current.enabled && !current.scenePaused
      if (playing) return { ...current, enabled: false, chosenBy: 'visitor' }

      return {
        enabled: true,
        chosenBy: 'visitor',
        scenePaused: false,
        // Pressing play after an automatic pause means "animate anyway".
        autoPause: current.scenePaused ? false : current.autoPause,
      }
    })
  }, [])

  const reportSlowScene = useCallback(() => {
    setState((current) =>
      current.enabled && current.autoPause && !current.scenePaused
        ? { ...current, scenePaused: true }
        : current,
    )
  }, [])

  // Remember a choice the visitor made themselves.
  useEffect(() => {
    if (state.chosenBy === 'visitor') saveChoice(state.enabled ? 'on' : 'off')
  }, [state.chosenBy, state.enabled])

  // When the site listens to the system setting: until the visitor chooses,
  // keep following it, even if it changes while the page is open.
  useEffect(() => {
    if (!motionSettings.respectSystemSetting || state.chosenBy !== 'default') return undefined

    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const follow = () => {
      setState((current) =>
        current.chosenBy === 'default' ? { ...current, enabled: !query.matches } : current,
      )
    }
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
  }, [state.chosenBy])

  // The stylesheet reads this attribute (see "Motion off" in index.css).
  useLayoutEffect(() => {
    document.documentElement.dataset.motion = state.enabled ? 'on' : 'off'
  }, [state.enabled])

  const value = useMemo(() => {
    let pausedBy = null
    if (!state.enabled) pausedBy = state.chosenBy === 'visitor' ? 'visitor' : 'system'
    else if (state.scenePaused) pausedBy = 'performance'

    return {
      enabled: state.enabled,
      scenePlaying: state.enabled && !state.scenePaused,
      pausedBy,
      toggle,
      reportSlowScene,
    }
  }, [state, toggle, reportSlowScene])

  useEffect(() => {
    printDevHint(value.pausedBy)
  }, [value.pausedBy])

  return (
    <MotionContext value={value}>
      {/* Framer Motion follows the same setting: with motion off, its
          animations fade instead of moving. */}
      <MotionConfig reducedMotion={state.enabled ? 'never' : 'always'}>{children}</MotionConfig>
    </MotionContext>
  )
}
