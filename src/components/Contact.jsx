import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { profile } from '../data/profile.js'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js'
import ButtonLink from './ui/ButtonLink.jsx'
import { ArrowUpIcon, CheckIcon, CopyIcon } from './ui/Icons.jsx'
import { Section, SectionHeader } from './ui/Section.jsx'

const YEAR = new Date().getFullYear()

if (import.meta.env.DEV && profile.email.endsWith('@example.com')) {
  console.warn('Contact section: set your real email address in src/data/profile.js.')
}

const BUTTON_LABELS = {
  idle: 'Copy email',
  copied: 'Copied',
  failed: 'Not copied',
}

const STATUS_MESSAGES = {
  idle: '',
  copied: 'Email address copied to the clipboard.',
  failed:
    'The browser blocked copying. The address is selected: press Ctrl+C (⌘C on a Mac) to copy it.',
}

export default function Contact() {
  const address = useRef(null)
  const { status, copy } = useCopyToClipboard()

  const handleCopy = async () => {
    const copied = await copy(profile.email)
    // If the browser refuses, select the address so one keystroke copies it.
    if (!copied && address.current) window.getSelection()?.selectAllChildren(address.current)
  }

  return (
    <Section as="footer" id="contact" labelledBy="contact-title" className="isolate pb-10 md:pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[30rem] bg-[radial-gradient(50%_100%_at_50%_100%,rgb(139_92_246/0.16),transparent)]"
      />

      <SectionHeader
        id="contact-title"
        title="Get in touch"
        lead="Email is the fastest way to reach me. My code is on GitHub and my background is on LinkedIn."
      />

      <p
        ref={address}
        className="mt-12 font-mono text-[clamp(1.25rem,4.2vw,2.75rem)] tracking-[-0.03em] [overflow-wrap:anywhere] text-zinc-50"
      >
        {profile.email}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-12 min-w-[10.5rem] items-center justify-center gap-2 rounded-full bg-zinc-50 px-6 max-sm:w-full text-[0.9375rem] font-medium text-obsidian transition-[background-color,box-shadow] duration-300 hover:bg-white hover:shadow-[0_8px_40px_-8px_rgb(6_182_212/0.6),0_8px_50px_-6px_rgb(139_92_246/0.55)]"
        >
          {/* The label swaps in place to confirm what just happened. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="inline-flex items-center gap-2"
            >
              {status === 'copied' ? <CheckIcon /> : <CopyIcon />}
              {BUTTON_LABELS[status]}
            </motion.span>
          </AnimatePresence>
        </button>

        <ButtonLink href={profile.github} external className="max-sm:flex-1">
          GitHub
        </ButtonLink>
        <ButtonLink href={profile.linkedin} external className="max-sm:flex-1">
          LinkedIn
        </ButtonLink>
      </div>

      {/* Announces the result to screen readers. Shown to everyone only when
          copying fails, because then the visitor has something left to do. */}
      <p role="status" className={status === 'failed' ? 'mt-4 text-sm text-zinc-400' : 'sr-only'}>
        {STATUS_MESSAGES[status]}
      </p>

      <div className="mt-24 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between md:mt-32">
        <p>
          &copy; {YEAR} {profile.name}
        </p>
        <p>{profile.location}</p>
        <a
          href="#top"
          className="inline-flex items-center gap-2 self-start text-zinc-300 transition-colors duration-300 hover:text-zinc-50 sm:self-auto"
        >
          Back to top
          <ArrowUpIcon />
        </a>
      </div>
    </Section>
  )
}
