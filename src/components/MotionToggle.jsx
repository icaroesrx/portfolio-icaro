import { useMotion } from '../context/motion.js'
import { PauseIcon, PlayIcon } from './ui/Icons.jsx'

// Shown beside the play button when the scene is still for a reason the
// visitor did not choose, so a paused scene never looks broken.
const REASONS = {
  system: 'Paused: your system asks for reduced motion.',
  performance: 'Paused to keep this page smooth on your device.',
}

const PLAYING = 'grid size-10 place-items-center border-white/12 bg-white/4 text-zinc-300 hover:border-white/30 hover:text-zinc-50'
const PAUSED =
  'inline-flex h-10 items-center gap-2 border-neon-cyan/60 bg-neon-cyan/10 pr-4 pl-3 text-sm font-medium text-cyan-100 shadow-[0_0_24px_-8px_rgb(6_182_212/0.8)] hover:bg-neon-cyan/20'

/**
 * Play/pause control for the site's motion.
 *
 * While the scene plays it is a quiet icon button. While the scene is still
 * it grows a label, and says why if the pause was not the visitor's choice.
 */
export default function MotionToggle({ className = '' }) {
  const { scenePlaying, pausedBy, toggle } = useMotion()
  const reason = REASONS[pausedBy]
  const label = scenePlaying ? 'Pause animation' : 'Play animation'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {reason && <p className="max-w-72 text-right text-xs/5 text-zinc-300 max-sm:sr-only">{reason}</p>}
      <button
        type="button"
        onClick={toggle}
        title={label}
        className={`shrink-0 rounded-full border backdrop-blur-md transition-colors duration-300 ${scenePlaying ? PLAYING : PAUSED}`}
      >
        {scenePlaying ? <PauseIcon /> : <PlayIcon />}
        <span className={scenePlaying ? 'sr-only' : undefined}>{label}</span>
      </button>
    </div>
  )
}
