import { profile } from '../data/profile.js'
import { projects } from '../data/projects.js'
import { layerOf } from '../data/stack.js'
import ButtonLink from './ui/ButtonLink.jsx'
import { ArrowUpRightIcon } from './ui/Icons.jsx'
import ProjectCover from './ui/ProjectCover.jsx'
import { Section, SectionHeader } from './ui/Section.jsx'
import Tilt from './ui/Tilt.jsx'

// Tags share the site's color code: cyan for interface work, violet for logic.
const TAG_TONES = {
  interface: 'border-neon-cyan/30 bg-neon-cyan/10 text-cyan-200',
  logic: 'border-neon-violet/40 bg-neon-violet/10 text-violet-200',
  neutral: 'border-white/12 bg-white/5 text-zinc-300',
}

function CardLink({ href, label, context }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group/link inline-flex items-center gap-1.5 font-medium text-zinc-100 transition-colors duration-300 hover:text-cyan-300"
    >
      {label}
      <span className="sr-only">
        : {context} (opens in a new tab)
      </span>
      <ArrowUpRightIcon className="size-4 opacity-60 transition-[opacity,translate] duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100" />
    </a>
  )
}

/**
 * One project. The card tilts toward the pointer, and on hover the cover and
 * the text lift off the glass by different amounts for a sense of depth.
 */
function ProjectCard({ project }) {
  return (
    <Tilt max={6} className="h-full">
      <div className="glass absolute inset-0 rounded-[2rem]" />
      <div className="glare absolute inset-0 rounded-[2rem]" />

      <article className="relative flex h-full flex-col p-4" style={{ transformStyle: 'preserve-3d' }}>
        <div
          className="lift relative aspect-[16/9] overflow-hidden rounded-[1.25rem] border border-white/8 bg-[radial-gradient(120%_90%_at_50%_0%,rgb(255_255_255/0.07),transparent_70%)]"
          style={{ '--lift': '18px' }}
        >
          <ProjectCover cover={project.cover} image={project.image} title={project.title} />
          {project.sample && (
            <span className="absolute top-3 left-3 rounded-full border border-dashed border-white/35 bg-obsidian/75 px-2.5 py-1 font-mono text-[0.6875rem] text-zinc-200">
              Sample project
            </span>
          )}
        </div>

        <div className="lift flex flex-1 flex-col px-3 pt-6 pb-3 sm:px-4" style={{ '--lift': '38px' }}>
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-zinc-50">{project.title}</h3>
          <p className="mt-3 text-pretty text-zinc-400">{project.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className={`rounded-full border px-3 py-1 font-mono text-xs ${TAG_TONES[layerOf(tag)]}`}
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-x-7 gap-y-2 pt-8">
            <CardLink href={project.repo} label="Source code" context={project.title} />
            {project.demo && <CardLink href={project.demo} label="Live demo" context={project.title} />}
          </div>
        </div>
      </article>
    </Tilt>
  )
}

export default function Projects() {
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeader
        id="projects-title"
        title="Featured projects"
        lead="A selection of recent work. Every project links to its source code on GitHub."
        action={
          <ButtonLink href={profile.repositories} external className="self-start md:self-auto">
            All repositories
          </ButtonLink>
        }
      />

      <ul className="mt-16 grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.title}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
