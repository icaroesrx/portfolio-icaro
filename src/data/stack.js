/**
 * Core technologies, grouped by where they sit in a web application.
 *
 * `layer` drives the accent color used across the site:
 *   'interface' -> cyan    what people see and touch
 *   'logic'     -> violet  what runs underneath
 *
 * Each item has a `symbol` (a short monogram shown on its badge), a `name`
 * and a one-line `note`.
 */
export const stack = [
  {
    layer: 'interface',
    title: 'Interface',
    summary: 'What people see and touch.',
    items: [
      { symbol: '</>', name: 'HTML & CSS', note: 'Semantic, responsive layouts' },
      { symbol: 'JS', name: 'JavaScript', note: 'Interaction and dynamic behavior' },
      { symbol: 'Bs', name: 'Bootstrap', note: 'Responsive components and grids' },
      { symbol: 'Fg', name: 'Figma', note: 'UI/UX prototyping' },
    ],
  },
  {
    layer: 'logic',
    title: 'Under the hood',
    summary: 'What keeps it running.',
    items: [
      { symbol: 'Jv', name: 'Java', note: 'Object-oriented back-end logic' },
      { symbol: 'Py', name: 'Python', note: 'Scripting and back-end logic' },
      { symbol: 'Pg', name: 'PostgreSQL', note: 'Relational data and SQL' },
      { symbol: 'git', name: 'Git', note: 'Version control' },
    ],
  },
]

/**
 * Which layer a project tag belongs to. Used to color the tags on project
 * cards. Add your own tags here; anything not listed renders in a neutral tone.
 */
const LAYER_BY_TAG = {
  html: 'interface',
  css: 'interface',
  javascript: 'interface',
  bootstrap: 'interface',
  figma: 'interface',
  react: 'interface',
  'three.js': 'interface',
  'tailwind css': 'interface',
  'framer motion': 'interface',

  java: 'logic',
  python: 'logic',
  postgresql: 'logic',
  sql: 'logic',
}

export function layerOf(tag) {
  return LAYER_BY_TAG[tag.toLowerCase()] ?? 'neutral'
}
