/**
 * Page section with the shared content width and vertical rhythm.
 * Pass `as="footer"` (or any other tag) to change the element.
 */
export function Section({ as: Tag = 'section', id, labelledBy, className = '', children }) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={`relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 md:py-28 lg:px-12 ${className}`}
    >
      {children}
    </Tag>
  )
}

/** Section title with an optional supporting line and an optional action on the right. */
export function SectionHeader({ id, title, lead, action }) {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2
          id={id}
          className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-zinc-50"
        >
          {title}
        </h2>
        {lead && <p className="mt-5 text-lg/8 text-pretty text-zinc-400">{lead}</p>}
      </div>
      {action}
    </header>
  )
}
