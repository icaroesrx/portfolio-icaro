import { useCallback, useEffect, useRef, useState } from 'react'

/** Works where the async Clipboard API is missing or blocked (older browsers, plain http). */
function legacyCopy(text) {
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()

  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }

  field.remove()
  return copied
}

/**
 * Copies text to the clipboard and reports what happened.
 *
 * `status` is 'idle', 'copied' or 'failed', and returns to 'idle' after
 * `resetAfter` milliseconds so the button can show a brief confirmation.
 */
export function useCopyToClipboard(resetAfter = 2400) {
  const [status, setStatus] = useState('idle')
  const timer = useRef(null)

  const copy = useCallback(
    async (text) => {
      let copied = false

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
          copied = true
        }
      } catch {
        // Permission denied or blocked by the browser: try the legacy route.
      }

      if (!copied) copied = legacyCopy(text)

      setStatus(copied ? 'copied' : 'failed')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setStatus('idle'), resetAfter)

      return copied
    },
    [resetAfter],
  )

  useEffect(() => () => clearTimeout(timer.current), [])

  return { status, copy }
}
