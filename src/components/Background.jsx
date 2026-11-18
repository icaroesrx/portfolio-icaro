/**
 * Page-wide atmosphere: two soft color fields that stay put while the content
 * scrolls over them (they are what the glass cards blur), and a film-grain
 * layer on top of everything.
 */
export default function Background() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] size-[75vmax] rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.11),transparent)]" />
        <div className="absolute top-[30%] -right-[25%] size-[75vmax] rounded-full bg-[radial-gradient(closest-side,rgb(6_182_212/0.09),transparent)]" />
      </div>
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[70]" />
    </>
  )
}
