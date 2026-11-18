import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { CAMERA, CYAN, VIOLET } from './config.js'

// The field fills a box behind and around the knot. Positions are generated in
// a unit cube and stretched to this box in the vertex shader, so the field can
// follow the canvas aspect ratio without being rebuilt.
const DEPTH = { far: -9, near: 2.5 }
const HALF_HEIGHT = Math.tan((CAMERA.fov * Math.PI) / 360) * (CAMERA.z - DEPTH.far) * 1.15

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform vec2 uBox;
  uniform vec2 uDepth;
  uniform float uAspect;
  uniform float uHeight;
  uniform float uStacked;

  attribute float aScale;
  attribute float aPhase;
  attribute float aTint;

  varying float vAlpha;
  varying float vTint;

  const float TAU = 6.2831853;

  void main() {
    vec3 p = vec3(position.xy * uBox, mix(uDepth.x, uDepth.y, position.z * 0.5 + 0.5));

    // Idle: every particle wanders on its own small loop.
    float t = uTime * 0.26 + aPhase * TAU;
    p.x += sin(t) * 0.18;
    p.y += cos(t * 0.8) * 0.18;

    // Scroll: the field rises and drifts toward the viewer at varying speeds.
    p.y += uScroll * (1.2 + aScale * 1.6);
    p.z += uScroll * 2.4 * aPhase;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mvPosition;

    vec2 screen = clip.xy / clip.w; // -1 to 1 across the canvas

    // Pointer: push particles away from the cursor. Measured on screen, so the
    // effect lines up with the cursor at any depth.
    vec2 offset = screen - uPointer;
    offset.x *= uAspect;
    float dist = length(offset);
    float push = (1.0 - smoothstep(0.0, 0.42, dist)) * uPointerStrength;
    vec2 direction = offset / max(dist, 0.0001);
    direction.x /= uAspect;
    clip.xy += direction * push * 0.11 * clip.w;

    gl_Position = clip;

    // World-space diameter converted to device pixels at this depth.
    float depth = -mvPosition.z;
    float size = (0.055 + 0.04 * push) * aScale * uHeight * 0.5 * projectionMatrix[1][1] / depth;
    gl_PointSize = max(size, 1.5);

    float twinkle = 0.6 + 0.4 * sin(uTime * (0.5 + aPhase) + aPhase * 40.0);
    float depthFade = (1.0 - smoothstep(6.0, 19.0, depth)) * smoothstep(0.8, 2.4, depth);
    // Points smaller than a couple of pixels fade out instead of shimmering.
    float sizeFade = clamp(size / 2.5, 0.0, 1.0);

    // Stay quiet behind the headline and the introduction: the left side when
    // the copy sits beside the knot, the lower part when it sits below it.
    float clearOfCopy = mix(
      smoothstep(-0.95, 0.15, screen.x),
      smoothstep(-0.55, 0.35, screen.y),
      uStacked
    );
    // Dissolve toward the bottom edge instead of ending in a hard line.
    float edgeFade = smoothstep(-1.0, -0.7, screen.y);

    vAlpha = twinkle * depthFade * sizeFade * (1.3 + 0.6 * push);
    vAlpha *= mix(0.3, 1.0, clearOfCopy) * edgeFade;
    vTint = aTint;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vAlpha;
  varying float vTint;

  void main() {
    // Soft round sprite with a hot center.
    float d = length(gl_PointCoord - 0.5);
    float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 1.5);

    vec3 color = mix(uColorA, uColorB, smoothstep(0.3, 0.7, vTint));
    color = mix(color, vec3(1.0), glow * 0.45);

    gl_FragColor = vec4(color, glow * vAlpha);
    #include <colorspace_fragment>
  }
`

/** Small seeded random generator: the field looks the same on every visit. */
function createRandom(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createField(count) {
  const random = createRandom(7)
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const phases = new Float32Array(count)
  const tints = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = random() * 2 - 1
    positions[i * 3 + 1] = random() * 2 - 1
    positions[i * 3 + 2] = random() * 2 - 1
    scales[i] = 0.35 + random() ** 3 * 1.5 // mostly fine dust, a few larger motes
    phases[i] = random()
    tints[i] = random()
  }

  return { positions, scales, phases, tints }
}

/**
 * Particle field. Drifts on its own, parts around the cursor, and streams
 * past as the page scrolls. All motion runs in the vertex shader.
 *
 *   count    Number of particles.
 *   stacked  True when the page copy sits below the knot (narrow screens)
 *            instead of beside it. Decides where the field dims.
 *   input    Ref to the smoothed pointer, scroll and clock values from Scene.jsx.
 */
export default function Particles({ count, stacked, input }) {
  const points = useRef(null)
  const material = useRef(null)
  const field = useMemo(() => createField(count), [count])
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uPointerStrength: { value: 0 },
      uBox: { value: new THREE.Vector2(1, 1) },
      uDepth: { value: new THREE.Vector2(DEPTH.far, DEPTH.near) },
      uAspect: { value: 1 },
      uHeight: { value: 1 },
      uStacked: { value: 0 },
      uColorA: { value: new THREE.Color(CYAN) },
      uColorB: { value: new THREE.Color(VIOLET) },
    }),
    [],
  )

  useFrame((state) => {
    const { time, scroll, x, y, canvasX, canvasY, strength } = input.current
    const aspect = state.size.width / state.size.height

    // Write through the material: React Three Fiber copies the uniforms it is
    // given, so the object created above is only their initial state.
    const live = material.current.uniforms
    live.uTime.value = time
    live.uScroll.value = scroll
    live.uPointer.value.set(canvasX, canvasY)
    live.uPointerStrength.value = strength
    live.uBox.value.set(HALF_HEIGHT * aspect, HALF_HEIGHT)
    live.uAspect.value = aspect
    live.uHeight.value = state.size.height * state.viewport.dpr
    live.uStacked.value = stacked ? 1 : 0

    // The whole field leans with the pointer for a sense of depth.
    points.current.rotation.y = x * 0.1 + Math.sin(time * 0.05) * 0.06
    points.current.rotation.x = -y * 0.07
  })

  return (
    <points ref={points} key={count} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[field.positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[field.scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[field.phases, 1]} />
        <bufferAttribute attach="attributes-aTint" args={[field.tints, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={initialUniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}
