import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

import { useMotion } from '../context/motion.js'
import { profile } from '../data/profile.js'
import MotionToggle from './MotionToggle.jsx'
import ButtonLink from './ui/ButtonLink.jsx'
import ErrorBoundary from './ui/ErrorBoundary.jsx'

// three.js is heavy. Loading the canvas lazily keeps it out of the first
// bundle, so the headline is on screen before the 3D code has even arrived.
const HeroCanvas = lazy(() => import('./three/HeroCanvas.jsx'))

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]

// The page's one choreographed moment: the headline rises into place line by
// line, then the introduction and the buttons follow.
const sequence = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const rise = {
  hidden: { y: '110%' },
  shown: { y: '0%', transition: { duration: 1.1, ease: EASE_OUT_EXPO } },
}
const appear = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
}

/** One headline line. It slides up from behind its own bottom edge. */
function HeadlineLine({ children }) {
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span variants={rise} className="block">
        {children}
      </motion.span>
    </span>
  )
}

export default function Hero() {
  const section = useRef(null)
  const [sceneReady, setSceneReady] = useState(false)
  const { enabled: motionEnabled, scenePlaying, reportSlowScene } = useMotion()
  const inView = useInView(section, { margin: '200px 0px', initial: true })

  // 0 at the top of the page, 1 once the hero has scrolled out of view.
  // The same value drives the 3D scene, so page and scene stay in step.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const sceneY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])
  const copyOpacity = useTransform(scrollYProgress, [0.1, 1], [1, 0])

  return (
    <section
      id="top"
      ref={section}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
    >
      {/* Ambient glow behind the knot. It is also what remains if WebGL is unavailable. */}
      <div
        aria-hidden="true"
        className="absolute top-[30%] left-1/2 -z-20 size-[min(34rem,125vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(6_182_212/0.2),rgb(139_92_246/0.12)_55%,transparent)] side:top-1/2 side:left-[74%] side:size-[min(46rem,90svh)]"
      />

      {/* 3D scene. Lags behind the page and fades as the hero scrolls away. */}
      <motion.div
        aria-hidden="true"
        style={motionEnabled ? { y: sceneY, opacity: sceneOpacity } : undefined}
        className="absolute inset-0 -z-10"
      >
        <div
          className={`size-full transition-opacity duration-[1600ms] ease-out ${sceneReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <ErrorBoundary>
            <Suspense fallback={null}>
              <HeroCanvas
                scroll={scrollYProgress}
                offscreen={!inView}
                playing={scenePlaying}
                onSlow={reportSlowScene}
                onReady={() => setSceneReady(true)}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </motion.div>

      <motion.div
        style={motionEnabled ? { y: copyY, opacity: copyOpacity } : undefined}
        // Stacked layout: the top padding keeps the copy below the knot, which is
        // min(76.7vw, 42svh) across and starts 80px down (see three/config.js).
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pt-[calc(min(66vw,36svh)+5rem)] pb-12 sm:px-8 sm:pb-16 lg:px-12 side:justify-center side:pt-28 side:pb-20"
      >
        <motion.div
          variants={sequence}
          initial="hidden"
          animate="shown"
          // Side by side, the copy keeps to the left 46% of the screen, clear of the knot.
          className="max-w-[46rem] side:max-w-[min(46rem,46vw)]"
        >
          <h1
            id="hero-title"
            className="text-[clamp(2.75rem,min(8.6vw,12.5vh),7rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-zinc-50 [text-shadow:0_2px_28px_rgb(9_9_11/0.7)]"
          >
            <HeadlineLine>Solid logic.</HeadlineLine>{' '}
            <HeadlineLine>Polished interfaces.</HeadlineLine>
          </h1>

          <motion.p variants={appear} className="mt-5 max-w-xl text-base/7 text-pretty text-zinc-300 sm:text-lg/8 side:mt-8">
            I&rsquo;m <span className="font-medium text-zinc-50">{profile.name}</span>, a full-stack and
            front-end web developer and UI designer based in {profile.location}. I build clean,
            responsive web applications where dependable back-end logic meets carefully crafted
            interfaces.
          </motion.p>

          <motion.div variants={appear} className="mt-7 flex flex-wrap gap-3 sm:mt-9">
            <ButtonLink href="#projects" variant="primary" className="max-sm:w-full">
              Explore Projects
            </ButtonLink>
            <ButtonLink href={profile.github} external className="max-sm:flex-1">
              GitHub
            </ButtonLink>
            <ButtonLink href={profile.linkedin} external className="max-sm:flex-1">
              LinkedIn
            </ButtonLink>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Play/pause for the animation: under the navigation on small screens,
          in the bottom corner when the copy and the knot sit side by side. */}
      <MotionToggle className="absolute top-[5.5rem] right-4 z-10 sm:right-6 side:top-auto side:bottom-6" />

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-7 left-1/2 h-11 w-px -translate-x-1/2 overflow-hidden bg-white/10 max-lg:hidden [@media(max-height:720px)]:hidden"
      >
        <span className="absolute inset-0 animate-scroll-cue bg-zinc-200" />
      </div>
    </section>
  )
}
