import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { CYAN, VIOLET } from './config.js'

/**
 * Thickness map for the iridescent coating.
 *
 * Iridescence is thin-film interference: the color depends on how thick the
 * film is and the angle it is seen from. Varying the thickness along the tube
 * makes the colors band and shift across the surface instead of sitting flat.
 * The pattern is built from whole-number sine waves, so it tiles seamlessly.
 */
function createThicknessTexture(size = 128) {
  const data = new Uint8Array(size * size * 4)

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const u = (col / size) * Math.PI * 2
      const v = (row / size) * Math.PI * 2
      const value = 0.5 + 0.28 * Math.sin(u * 2 + Math.sin(v) * 1.2) + 0.22 * Math.sin(v * 3 + u)

      const i = (row * size + col) * 4
      data[i + 1] = Math.round(THREE.MathUtils.clamp(value, 0, 1) * 255) // three.js reads thickness from green
      data[i + 3] = 255
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true
  texture.repeat.set(6, 1)
  texture.needsUpdate = true
  return texture
}

/** A thin orbit ring with one bright node travelling along it. */
function Orbit({ innerRef, radius, color, nodeColor, rotation }) {
  return (
    <group rotation={rotation}>
      <group ref={innerRef}>
        <mesh>
          <torusGeometry args={[radius, 0.007, 8, 200]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
        </mesh>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={nodeColor} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * The centerpiece: an iridescent torus knot with two orbit rings.
 *
 * `input` is a ref to the smoothed pointer, scroll and clock values that
 * Scene.jsx updates every frame.
 */
export default function Knot({ input, layout }) {
  const rig = useRef(null)
  const body = useRef(null)
  const material = useRef(null)
  const orbitA = useRef(null)
  const orbitB = useRef(null)
  const thickness = useMemo(() => createThicknessTexture(), [])

  useFrame(() => {
    const { dt, time, scroll, x, y } = input.current

    // Idle: a steady tumble and a gentle bob. Clear enough to read as alive
    // at a glance, slow enough to stay calm.
    body.current.rotation.x = 0.35 + time * 0.13
    body.current.rotation.y = 0.5 + time * 0.21
    body.current.position.y = Math.sin(time * 0.7) * 0.1

    // Pointer: lean toward the cursor. Scroll: twist, rise and shrink.
    rig.current.rotation.x = -y * 0.35 + scroll * 0.9
    rig.current.rotation.y = x * 0.5 + scroll * 2.2
    rig.current.position.set(layout.x + x * 0.15, layout.y + y * 0.1 + scroll * 1.1, 0)
    rig.current.scale.setScalar(layout.scale * (1 - scroll * 0.3))

    orbitA.current.rotation.z += dt * 0.36
    orbitB.current.rotation.z -= dt * 0.24

    // Slide the film along the tube so the colors keep flowing.
    material.current.iridescenceThicknessMap.offset.x = (time * 0.02) % 1
  })

  return (
    <group ref={rig} position={[layout.x, layout.y, 0]} scale={layout.scale}>
      <group ref={body}>
        <mesh>
          <torusKnotGeometry args={[1, 0.34, 320, 48, 2, 3]} />
          <meshPhysicalMaterial
            ref={material}
            color="#a9c4ff"
            metalness={1}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.12}
            iridescence={1}
            iridescenceIOR={1.7}
            iridescenceThicknessRange={[200, 740]}
            iridescenceThicknessMap={thickness}
            envMapIntensity={1.35}
          />
        </mesh>
      </group>

      <Orbit innerRef={orbitA} radius={2.15} color={CYAN} nodeColor="#cffafe" rotation={[1.2, 0.25, 0]} />
      <Orbit innerRef={orbitB} radius={2.5} color={VIOLET} nodeColor="#ede9fe" rotation={[-0.9, -0.5, 0.4]} />
    </group>
  )
}
