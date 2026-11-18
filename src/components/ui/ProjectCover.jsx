import { useId } from 'react'

/**
 * Cover for a project card.
 *
 * If the project has an `image`, that screenshot is shown. Otherwise one of
 * four small line illustrations is drawn, picked by the project's `cover`
 * key in src/data/projects.js.
 */

const CYAN = '#06b6d4'
const VIOLET = '#8b5cf6'
const LINE = 'rgb(255 255 255 / 0.2)'
const PANEL = 'rgb(255 255 255 / 0.05)'
const INK = 'rgb(255 255 255 / 0.32)'

// A (2,3) torus knot seen face-on: the same curve as the 3D hero.
const KNOT_PATH = (() => {
  const steps = 240
  const points = []
  for (let i = 0; i < steps; i++) {
    const u = (i / steps) * Math.PI * 4
    const radius = (2 + Math.cos(1.5 * u)) * 24
    points.push(`${(160 + radius * Math.cos(u)).toFixed(1)} ${(100 + radius * Math.sin(u)).toFixed(1)}`)
  }
  return `M${points.join('L')}Z`
})()

/** 3D scene: the knot inside two orbits. */
function OrbitArt() {
  const gradientId = useId()
  return (
    <>
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="88" y1="28" x2="232" y2="172">
          <stop offset="0" stopColor={CYAN} />
          <stop offset="1" stopColor={VIOLET} />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="100" rx="130" ry="46" transform="rotate(-16 160 100)" fill="none" stroke={LINE} />
      <ellipse
        cx="160"
        cy="100"
        rx="108"
        ry="88"
        transform="rotate(28 160 100)"
        fill="none"
        stroke={LINE}
        strokeDasharray="1 8"
        strokeLinecap="round"
      />
      <path d={KNOT_PATH} fill="none" stroke={`url(#${gradientId})`} strokeWidth="7" strokeLinejoin="round" />
      <circle cx="285" cy="64" r="3.5" fill="#cffafe" />
      <circle cx="50" cy="150" r="2.5" fill="#ede9fe" />
    </>
  )
}

// Ticket board layout: card heights per column, stacked from the top.
const BOARD_COLUMNS = [
  { x: 46, heights: [28, 24, 30] },
  { x: 126, heights: [26, 36], active: 0 },
  { x: 206, heights: [30, 24, 24] },
].map(({ x, heights, active }) => {
  let top = 54
  const cards = heights.map((height, index) => {
    const card = { top, height, active: index === active }
    top += height + 7
    return card
  })
  return { x, cards }
})

/** Ticket board: three columns of cards, one of them active. */
function BoardArt() {
  return BOARD_COLUMNS.map((column) => (
    <g key={column.x}>
      <rect x={column.x} y="30" width="68" height="140" rx="10" fill={PANEL} stroke={LINE} />
      <rect x={column.x + 10} y="40" width="30" height="5" rx="2.5" fill={INK} />
      {column.cards.map((card) => (
        <g key={card.top}>
          <rect
            x={column.x + 8}
            y={card.top}
            width="52"
            height={card.height}
            rx="6"
            fill={card.active ? 'rgb(139 92 246 / 0.2)' : 'rgb(255 255 255 / 0.06)'}
            stroke={card.active ? VIOLET : LINE}
          />
          <rect x={column.x + 15} y={card.top + 8} width="26" height="3.5" rx="1.75" fill={INK} />
          <rect x={column.x + 15} y={card.top + 15} width="17" height="3.5" rx="1.75" fill={LINE} />
          {card.active && <circle cx={column.x + 51} cy={card.top + 9.5} r="2.5" fill={VIOLET} />}
        </g>
      ))}
    </g>
  ))
}

/** Landing page: a desktop window with its phone layout beside it. */
function LayoutArt() {
  return (
    <>
      {/* Browser window */}
      <rect x="34" y="26" width="206" height="148" rx="10" fill={PANEL} stroke={LINE} />
      <path d="M34 45h206" stroke={LINE} />
      <circle cx="46" cy="35.5" r="2.2" fill={INK} />
      <circle cx="54" cy="35.5" r="2.2" fill={INK} />
      <circle cx="62" cy="35.5" r="2.2" fill={INK} />
      <rect x="50" y="60" width="96" height="9" rx="4.5" fill="rgb(255 255 255 / 0.55)" />
      <rect x="50" y="75" width="68" height="9" rx="4.5" fill="rgb(255 255 255 / 0.55)" />
      <rect x="50" y="93" width="110" height="4" rx="2" fill={LINE} />
      <rect x="50" y="102" width="84" height="4" rx="2" fill={LINE} />
      <rect x="50" y="115" width="44" height="14" rx="7" fill={CYAN} />
      <rect x="50" y="142" width="50" height="22" rx="6" fill="rgb(255 255 255 / 0.06)" stroke={LINE} />
      <rect x="108" y="142" width="50" height="22" rx="6" fill="rgb(255 255 255 / 0.06)" stroke={LINE} />

      {/* Phone */}
      <rect x="208" y="56" width="78" height="130" rx="13" fill="#0c0c10" stroke="rgb(255 255 255 / 0.34)" />
      <rect x="221" y="74" width="40" height="6" rx="3" fill="rgb(255 255 255 / 0.55)" />
      <rect x="221" y="85" width="28" height="6" rx="3" fill="rgb(255 255 255 / 0.55)" />
      <rect x="221" y="99" width="32" height="11" rx="5.5" fill={CYAN} />
      <rect x="221" y="121" width="52" height="20" rx="5" fill="rgb(255 255 255 / 0.06)" stroke={LINE} />
      <rect x="221" y="147" width="52" height="20" rx="5" fill="rgb(255 255 255 / 0.06)" stroke={LINE} />
    </>
  )
}

/** Dashboard: two summary tiles, a bar chart and a trend line. */
function ChartArt() {
  const heights = [34, 52, 44, 70, 62, 88, 78, 104]
  const baseline = 160
  const trend = heights.map((height, index) => `${60 + index * 28} ${baseline - height - 12}`).join('L')

  return (
    <>
      <rect x="40" y="28" width="62" height="28" rx="7" fill={PANEL} stroke={LINE} />
      <rect x="49" y="37" width="22" height="4" rx="2" fill={LINE} />
      <rect x="49" y="45" width="36" height="4" rx="2" fill={INK} />
      <rect x="110" y="28" width="62" height="28" rx="7" fill={PANEL} stroke={LINE} />
      <rect x="119" y="37" width="22" height="4" rx="2" fill={LINE} />
      <rect x="119" y="45" width="30" height="4" rx="2" fill={INK} />

      {heights.map((height, index) => (
        <rect
          key={index}
          x={52 + index * 28}
          y={baseline - height}
          width="16"
          height={height}
          rx="4"
          fill={index >= heights.length - 2 ? VIOLET : 'rgb(139 92 246 / 0.28)'}
        />
      ))}
      <path d="M40 160.5h240" stroke={LINE} />
      <path d={`M${trend}`} fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={60 + (heights.length - 1) * 28} cy={baseline - heights.at(-1) - 12} r="4" fill={CYAN} />
    </>
  )
}

const ART = { orbit: OrbitArt, board: BoardArt, layout: LayoutArt, chart: ChartArt }

/** Accepts a path inside /public (with or without a leading slash) or a full URL. */
function resolveImage(image) {
  if (/^(https?:)?\/\//.test(image) || image.startsWith('data:')) return image
  return `${import.meta.env.BASE_URL}${image.replace(/^\/+/, '')}`
}

export default function ProjectCover({ cover, image, title }) {
  if (image) {
    return (
      <img
        src={resolveImage(image)}
        alt={`Screenshot of ${title}`}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
    )
  }

  const Art = ART[cover] ?? OrbitArt

  return (
    <svg viewBox="0 6 320 188" aria-hidden="true" focusable="false" className="size-full">
      <Art />
    </svg>
  )
}
