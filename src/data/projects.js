import { profile } from './profile.js'

/**
 * FEATURED PROJECTS
 * -----------------
 * This is the only file you need to edit to change the Projects section.
 * Add, remove or reorder entries and the grid updates itself.
 *
 * Each project has:
 *
 *   title        Card heading.
 *   description  One or two sentences about what it is and how it is built.
 *   tags         Technologies used. Tags that appear in src/data/stack.js are
 *                colored by layer (cyan = interface, violet = logic).
 *   repo         Link to the source code on GitHub.
 *   demo         Live demo URL. Leave it as '' to hide the "Live demo" button.
 *   image        Optional screenshot. Put the file in /public and write its
 *                path here, e.g. 'projects/service-desk.webp'.
 *                Leave it as '' to use a generated cover instead.
 *   cover        Generated cover style, used when there is no image:
 *                'orbit' | 'board' | 'layout' | 'chart'
 *   sample       Optional. `true` shows a "Sample project" label on the card.
 *
 * NOTE: the first entry is this website. The other three are sample projects
 * written to match the tech stack, and they are labelled as samples on the
 * page. Replace them with your own work, point each `repo` at the real
 * repository, and leave out `sample: true`.
 */
export const projects = [
  {
    title: 'Interactive 3D Portfolio',
    description:
      'This website. A WebGL hero built with Three.js and React Three Fiber, a glass interface in Tailwind CSS, and motion driven by the pointer and the scroll.',
    tags: ['React', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
    repo: profile.repositories,
    demo: '',
    image: '',
    cover: 'orbit',
  },
  {
    title: 'Service Desk',
    description:
      'A ticketing web app for small IT teams. Requests arrive through a responsive Bootstrap interface and are tracked by a Java back end on PostgreSQL.',
    tags: ['Java', 'PostgreSQL', 'Bootstrap', 'JavaScript'],
    repo: profile.repositories,
    demo: '',
    image: '',
    cover: 'board',
    sample: true,
  },
  {
    title: 'Landing Page Kit',
    description:
      'A set of responsive landing page sections, prototyped in Figma and built with semantic HTML, modern CSS and a little vanilla JavaScript.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    repo: profile.repositories,
    demo: '',
    image: '',
    cover: 'layout',
    sample: true,
  },
  {
    title: 'Data Dashboard',
    description:
      'Python scripts clean CSV exports and load them into PostgreSQL. A lightweight JavaScript dashboard turns the results into charts.',
    tags: ['Python', 'PostgreSQL', 'JavaScript'],
    repo: profile.repositories,
    demo: '',
    image: '',
    cover: 'chart',
    sample: true,
  },
]
