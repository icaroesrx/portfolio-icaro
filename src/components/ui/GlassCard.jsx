/**
 * A static glass panel whose hairline border glows around the pointer.
 * For cards that should also tilt in 3D, use Tilt.jsx instead.
 */
export default function GlassCard({ as: Tag = 'div', className = '', children }) {
  const handleMove = (event) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    element.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    element.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  return (
    <Tag onPointerMove={handleMove} className={`glass spotlight ${className}`}>
      {children}
    </Tag>
  )
}
