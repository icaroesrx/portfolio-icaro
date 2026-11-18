import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { profile } from '../data/profile.js'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { CloseIcon, MenuIcon } from './ui/Icons.jsx'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

// 'top' is the hero: while it is on screen, no link is highlighted.
const SECTION_IDS = ['top', ...LINKS.map((link) => link.id)]

export default function Navbar() {
  const activeId = useActiveSection(SECTION_IDS)
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="glass mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full bg-obsidian/70 pr-2 pl-6">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight text-zinc-50">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-linear-to-br from-neon-cyan to-neon-violet"
          />
          {profile.firstName}
        </a>

        {/* Desktop links */}
        <nav aria-label="Primary" className="max-md:hidden">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => {
              const active = activeId === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active ? 'location' : undefined}
                    className={`relative block rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                      active ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    {active && (
                      // One shared element: it slides from link to link as the page scrolls.
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-10 place-items-center rounded-full text-zinc-100 transition-colors hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Primary"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass mx-auto mt-2 max-w-5xl origin-top rounded-3xl bg-obsidian/80 p-2 md:hidden"
          >
            <ul>
              {LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={activeId === link.id ? 'location' : undefined}
                    className={`block rounded-2xl px-4 py-3 text-lg transition-colors ${
                      activeId === link.id ? 'bg-white/10 text-zinc-50' : 'text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
