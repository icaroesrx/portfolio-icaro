import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently crossing the middle of the
 * viewport, so the navigation can highlight it.
 *
 * Pass a stable array (define it once, outside the component).
 */
export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (sections.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      // Shrinks the observed area to a thin band across the viewport's middle.
      { rootMargin: '-45% 0px -50% 0px' },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
