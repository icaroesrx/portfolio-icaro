import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { CYAN, VIOLET } from './config.js'

// A small studio of glowing panels around the scene. The panels are never
// drawn directly: they are rendered once into an environment map, and that
// map is what the knot's surface reflects. Brightness above 1 is fine here,
// because the map stores high dynamic range values.
const PANELS = [
  { color: '#e0f7ff', brightness: 3, position: [0, 6, 2], size: [9, 3] }, // key light overhead
  { color: CYAN, brightness: 8, position: [7, 1, 2], size: [4, 10] }, // accent, right
  { color: VIOLET, brightness: 5, position: [-7, -1, 2], size: [3, 9] }, // accent, left
  { color: '#a5f3fc', brightness: 1.8, position: [0, 0, 9], size: [5, 5] }, // behind the camera
  { color: '#c4b5fd', brightness: 1, position: [0, -6, 1], size: [9, 9] }, // soft fill from below
  { color: '#1e1b4b', brightness: 1, position: [0, 0, -10], size: [30, 20] }, // deep backdrop, lifts the shadows
]

function createStudio() {
  const studio = new THREE.Scene()

  for (const { color, brightness, position, size } of PANELS) {
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false })
    material.color.set(color).multiplyScalar(brightness)

    const panel = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), material)
    panel.position.set(position[0], position[1], position[2])
    panel.lookAt(0, 0, 0)
    studio.add(panel)
  }

  return studio
}

/** Builds the reflection map in code, so nothing has to be downloaded. */
function StudioEnvironment() {
  const gl = useThree((state) => state.gl)
  const getState = useThree((state) => state.get)

  useLayoutEffect(() => {
    const { scene } = getState()
    const studio = createStudio()
    const generator = new THREE.PMREMGenerator(gl)
    const target = generator.fromScene(studio, 0, 0.1, 40)
    scene.environment = target.texture

    return () => {
      scene.environment = null
      target.dispose()
      generator.dispose()
      studio.traverse((object) => {
        object.geometry?.dispose()
        object.material?.dispose()
      })
    }
  }, [gl, getState])

  return null
}

/**
 * Lights for the hero scene. Direct lights give the knot its shape; the
 * environment gives its surface something to reflect.
 */
export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 6]} intensity={2} />
      <pointLight position={[6, 3, 3]} intensity={70} color={CYAN} />
      <pointLight position={[-6, -3, 4]} intensity={70} color={VIOLET} />
      <StudioEnvironment />
    </>
  )
}
