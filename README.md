# Portfolio of Ícaro Eduardo

A single-page portfolio with an interactive 3D hero: an iridescent torus knot and a particle field that follow the pointer and the scroll.

Built with React 19, Vite, Tailwind CSS 4, Framer Motion and Three.js through React Three Fiber.

## Run it

You need Node.js 20.19 or newer (22.12 or newer on the 22 line).

```bash
npm install
npm run dev        # http://localhost:5173, with hot reload
```

Other commands:

```bash
npm run build      # production build in dist/
npm run preview    # serve dist/ locally to check the build
npm run lint       # Oxlint
```

## Make it yours

All content lives in four small files. You should not need to touch a component to update the site.

| File | What it controls |
| --- | --- |
| `src/data/profile.js` | Name, role, location, **email**, GitHub and LinkedIn links |
| `src/data/projects.js` | The Featured projects grid: titles, descriptions, tags, repo and live demo links, screenshots |
| `src/data/journey.js` | The timeline in About & experience |
| `src/data/stack.js` | The Tech stack badges, and which color each project tag gets |
| `src/data/motion.js` | Whether the site starts animated for everyone, and whether the 3D scene pauses itself on slow devices |

Before you publish:

1. **Set your email** in `src/data/profile.js`. It ships with `your.email@example.com`.
2. **Replace the sample projects** in `src/data/projects.js`. The first entry is this website; the other three are examples written to match the tech stack, and each shows a "Sample project" label on its card. Write your own entries without `sample: true` and point each `repo` at the real repository.
3. Check the wording of the timeline in `src/data/journey.js` and of the Background card in `src/components/About.jsx`.

To show a screenshot on a project card, put the image in `public/` (for example `public/projects/service-desk.webp`) and set `image: 'projects/service-desk.webp'` on that project. Without an image, the card draws one of four built-in illustrations, chosen by `cover`.

The page title, description and social preview text are in `index.html`.

## Design tokens

Colors and fonts are defined once, in the `@theme` block at the top of `src/index.css`:

| Token | Value | Used as |
| --- | --- | --- |
| `--color-obsidian` | `#09090b` | Page background |
| `--color-neon-cyan` | `#06b6d4` | Interface layer: front-end tools, links, focus rings |
| `--color-neon-violet` | `#8b5cf6` | Logic layer: back-end and data tools |
| `--font-sans` | Inter | Headings and body text |
| `--font-mono` | JetBrains Mono | Code-like details: badges, tags, the email address |

Tailwind turns each token into utilities such as `bg-obsidian`, `text-neon-cyan` and `font-mono`. Both fonts are bundled with the site through Fontsource, so nothing is requested from a third party.

## Project structure

```text
icaro-portfolio/
├── index.html                  Page metadata and the root element
├── vite.config.js              Vite, React and Tailwind setup
├── public/
│   └── favicon.svg
├── .github/workflows/
│   └── deploy.yml              GitHub Pages deployment
└── src/
    ├── main.jsx                Entry point, loads fonts and styles
    ├── App.jsx                 Page layout: which sections, in which order
    ├── index.css               Design tokens, base styles, glass and tilt effects
    ├── data/                   Everything you are likely to edit
    │   ├── profile.js
    │   ├── projects.js
    │   ├── journey.js
    │   ├── stack.js
    │   └── motion.js
    ├── context/
    │   └── motion.js               useMotion(): is the site allowed to move?
    ├── hooks/
    │   ├── usePointer.js           Pointer position for the 3D scene
    │   ├── useMediaQuery.js        Tells the 3D scene which hero layout is active
    │   ├── useActiveSection.js     Which section the navigation highlights
    │   ├── useCopyToClipboard.js   The copy-email button
    │   └── useLocalTime.js         Live clock in the About section
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── About.jsx
        ├── Journey.jsx             Timeline inside About
        ├── TechStack.jsx
        ├── Projects.jsx
        ├── Contact.jsx             Footer with the contact buttons
        ├── Background.jsx          Page-wide glow and film grain
        ├── MotionProvider.jsx      Owns the motion setting (system, visitor, performance)
        ├── MotionToggle.jsx        Play/pause button in the hero
        ├── three/                  The 3D hero scene
        │   ├── HeroCanvas.jsx      Canvas, pixel ratio, automatic quality steps
        │   ├── Scene.jsx           Camera, input smoothing, scene contents
        │   ├── Knot.jsx            Iridescent torus knot and orbit rings
        │   ├── Particles.jsx       Particle field (custom shader)
        │   ├── Lighting.jsx        Lights and the reflection environment
        │   └── config.js           Camera, colors, layout per screen size
        └── ui/                     Shared building blocks
            ├── Tilt.jsx            3D tilt that follows the pointer
            ├── GlassCard.jsx       Static glass panel with a glowing border
            ├── ProjectCover.jsx    Screenshot or built-in illustration
            ├── ScrollLitText.jsx   Text that lights up as you scroll
            ├── ButtonLink.jsx
            ├── Section.jsx
            ├── Icons.jsx
            └── ErrorBoundary.jsx
```

## How the 3D hero behaves

- **Pointer.** The knot leans toward the cursor, the camera drifts for parallax, and particles move out of the cursor's way.
- **Scroll.** As the hero scrolls away, the knot twists and recedes, the particle field streams upward, and the scene fades into the next section.
- **Small screens.** On portrait phones and tablets the knot sits above the headline instead of beside it, with fewer particles. The switch is the `side` variant in `src/index.css`, mirrored by `SIDE_BY_SIDE_QUERY` in `three/config.js`.
- **Performance.** three.js loads in its own chunk after the text is on screen. Rendering stops completely while the hero is off screen.
- **No WebGL.** The page works without it. The hero keeps its glow and the rest of the site is unaffected.

To tune the look, start with `src/components/three/config.js` (camera, accent colors, knot position per screen size), then the material and rotation speeds in `Knot.jsx` and the panel colors in `Lighting.jsx`.

## When the site animates

The site starts animated for every visitor. The hero has a play/pause button (bottom right on wide screens, under the navigation on phones), and the browser remembers what a visitor chose (`localStorage`, key `motion`).

Two switches in `src/data/motion.js` control the exceptions:

- **`respectSystemSetting`** (off). Operating systems have a "reduce motion" accessibility option, which browsers pass on to websites (on Windows 11: Settings → Accessibility → Visual effects → Animation effects). People usually switch it on because movement on screen makes them dizzy or unwell. With this switch off, the site animates for them too and they can press pause. Turn it on to start paused for those visitors instead: they see a "Play animation" button, and nothing changes for anyone else.
- **`pauseWhenSlow`** (on). If the frame rate stays below 45 fps, the 3D scene first drops to 1x resolution. If it then stays below 20 fps for five seconds, which is what a browser without graphics acceleration produces, the scene pauses itself and shows "Play animation" with the reason beside it.

While the site is paused there is no 3D animation, no tilt and no parallax. During development, the reason for a pause is also printed in the browser console.

The logic lives in `src/components/MotionProvider.jsx`. Components read it with the `useMotion()` hook from `src/context/motion.js`, and the stylesheet reads the `data-motion` attribute it sets on `<html>`.

## Deploy

The build uses relative asset paths (`base: './'` in `vite.config.js`), so the same `dist/` folder works at a domain root and under a sub-path.

### Vercel

1. Push the project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects Vite. Keep the defaults (build command `npm run build`, output directory `dist`) and deploy.

### GitHub Pages

1. Push the project to a GitHub repository, with `main` as the default branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it. The address appears in the workflow run and under Settings → Pages.

## Notes

- **three.js is held at 0.182.** React Three Fiber 9 uses `THREE.Clock`, which three.js 0.183 and later report as deprecated in the console on every page load. Lift the version when you move to a React Three Fiber release that no longer uses it.
- **`npm audit` reports `picomatch`.** It comes from Vite's own build tooling and is not part of the deployed site. Do not run `npm audit fix --force`: it would downgrade Vite to version 6 and break the build.
