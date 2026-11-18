import { ArrowUpRightIcon } from './Icons.jsx'

const BASE =
  'group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-medium whitespace-nowrap transition-[background-color,border-color,box-shadow,color] duration-300'

const VARIANTS = {
  // Solid, for the one primary action on screen.
  primary:
    'bg-zinc-50 text-obsidian hover:bg-white hover:shadow-[0_8px_40px_-8px_rgb(6_182_212/0.6),0_8px_50px_-6px_rgb(139_92_246/0.55)]',
  // Glass, for everything else.
  glass:
    'border border-white/12 bg-white/4 text-zinc-100 backdrop-blur-md hover:border-neon-cyan/60 hover:bg-white/8 hover:shadow-[0_0_32px_-10px_rgb(6_182_212/0.8)]',
}

/**
 * A link styled as a button.
 * `external` opens the link in a new tab and adds an arrow so that is clear
 * before the click.
 */
export default function ButtonLink({ href, variant = 'glass', external = false, className = '', children }) {
  const externalProps = external ? { target: '_blank', rel: 'noreferrer noopener' } : {}

  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...externalProps}>
      {children}
      {external && (
        <>
          <ArrowUpRightIcon className="size-4 opacity-60 transition-[opacity,translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  )
}
