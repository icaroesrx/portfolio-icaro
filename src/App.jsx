import About from './components/About.jsx'
import Background from './components/Background.jsx'
import Contact from './components/Contact.jsx'
import Hero from './components/Hero.jsx'
import MotionProvider from './components/MotionProvider.jsx'
import Navbar from './components/Navbar.jsx'
import Projects from './components/Projects.jsx'
import TechStack from './components/TechStack.jsx'

export default function App() {
  return (
    // MotionProvider decides whether the site moves (system setting first,
    // then the visitor's own choice) and shares that with every component.
    <MotionProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-zinc-50 focus:px-5 focus:py-3 focus:font-medium focus:text-obsidian"
      >
        Skip to content
      </a>

      <Background />
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <TechStack />
        <Projects />
      </main>

      <Contact />
    </MotionProvider>
  )
}
