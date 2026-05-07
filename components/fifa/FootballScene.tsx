'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const FOOTBALL_SUBDIVISIONS = 10

function isMesh(
  object: THREE.Object3D,
): object is THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]> {
  return (object as THREE.Mesh).isMesh === true
}

function cloneMaterial(material: THREE.Material) {
  const cloned = material.clone()

  if ('flatShading' in cloned) {
    ;(cloned as THREE.MeshStandardMaterial).flatShading = false
  }

  cloned.needsUpdate = true

  return cloned
}

function createRoundedGeometry(source: THREE.BufferGeometry, subdivisions: number) {
  const positions = source.getAttribute('position')
  const uvs = source.getAttribute('uv')
  const index = source.index
  const outputPositions: number[] = []
  const outputNormals: number[] = []
  const outputUvs: number[] = []

  source.computeBoundingSphere()

  const center = source.boundingSphere?.center.clone() ?? new THREE.Vector3()
  const radius = source.boundingSphere?.radius ?? 1
  const triangleCount = index ? index.count / 3 : positions.count / 3

  const getIndex = (vertex: number) => (index ? index.getX(vertex) : vertex)

  const readPosition = (vertex: number) =>
    new THREE.Vector3(
      positions.getX(vertex),
      positions.getY(vertex),
      positions.getZ(vertex),
    )

  const readUv = (vertex: number) =>
    uvs
      ? new THREE.Vector2(uvs.getX(vertex), uvs.getY(vertex))
      : new THREE.Vector2()

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const aIndex = getIndex(triangle * 3)
    const bIndex = getIndex(triangle * 3 + 1)
    const cIndex = getIndex(triangle * 3 + 2)

    const a = readPosition(aIndex)
    const b = readPosition(bIndex)
    const c = readPosition(cIndex)
    const uvA = readUv(aIndex)
    const uvB = readUv(bIndex)
    const uvC = readUv(cIndex)

    const sample = (i: number, j: number) => {
      const bWeight = i / subdivisions
      const cWeight = j / subdivisions
      const aWeight = 1 - bWeight - cWeight
      const position = new THREE.Vector3()
        .addScaledVector(a, aWeight)
        .addScaledVector(b, bWeight)
        .addScaledVector(c, cWeight)
      const normal = position.clone().sub(center).normalize()
      position.copy(center).addScaledVector(normal, radius)

      const uv = new THREE.Vector2()
        .addScaledVector(uvA, aWeight)
        .addScaledVector(uvB, bWeight)
        .addScaledVector(uvC, cWeight)

      return { position, normal, uv }
    }

    const pushVertex = (vertex: ReturnType<typeof sample>) => {
      outputPositions.push(vertex.position.x, vertex.position.y, vertex.position.z)
      outputNormals.push(vertex.normal.x, vertex.normal.y, vertex.normal.z)
      outputUvs.push(vertex.uv.x, vertex.uv.y)
    }

    for (let i = 0; i < subdivisions; i += 1) {
      for (let j = 0; j < subdivisions - i; j += 1) {
        const v0 = sample(i, j)
        const v1 = sample(i + 1, j)
        const v2 = sample(i, j + 1)

        pushVertex(v0)
        pushVertex(v1)
        pushVertex(v2)

        if (j < subdivisions - i - 1) {
          const v3 = sample(i + 1, j + 1)

          pushVertex(v1)
          pushVertex(v3)
          pushVertex(v2)
        }
      }
    }
  }

  const rounded = new THREE.BufferGeometry()
  rounded.setAttribute('position', new THREE.Float32BufferAttribute(outputPositions, 3))
  rounded.setAttribute('normal', new THREE.Float32BufferAttribute(outputNormals, 3))
  rounded.setAttribute('uv', new THREE.Float32BufferAttribute(outputUvs, 2))
  rounded.computeBoundingBox()
  rounded.computeBoundingSphere()

  return rounded
}

function Football() {
  const { scene } = useGLTF('/models/football/scene.gltf')
  const ref = useRef<THREE.Group>(null!)
  const roundedScene = useMemo(() => {
    const clone = scene.clone(true)
    const geometryCache = new Map<string, THREE.BufferGeometry>()

    clone.traverse((object) => {
      if (!isMesh(object)) {
        return
      }

      const originalGeometry = object.geometry
      let roundedGeometry = geometryCache.get(originalGeometry.uuid)

      if (!roundedGeometry) {
        roundedGeometry = createRoundedGeometry(originalGeometry, FOOTBALL_SUBDIVISIONS)
        geometryCache.set(originalGeometry.uuid, roundedGeometry)
      }

      object.geometry = roundedGeometry
      object.material = Array.isArray(object.material)
        ? object.material.map(cloneMaterial)
        : cloneMaterial(object.material)
      object.castShadow = true
    })

    return clone
  }, [scene])

  useFrame((_, delta) => {
    if (!ref.current) {
      return
    }

    ref.current.rotation.y += delta * 0.5
    ref.current.rotation.x += delta * 0.05
  })

  return (
    <group ref={ref} scale={0.04} position={[0, 0.1, 0]}>
      <primitive object={roundedScene} dispose={null} />
    </group>
  )
}

function Ground() {
  return (
    <>
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.7}
        scale={12}
        blur={2.2}
        far={5}
        color="#000000"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.06, 0]} receiveShadow>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial color="#0a1410" roughness={0.85} metalness={0.15} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.04, 0]}>
        <ringGeometry args={[0.9, 1.2, 64]} />
        <meshBasicMaterial color="#00c8ff" transparent opacity={0.55} toneMapped={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.03, 0]}>
        <ringGeometry args={[1.4, 1.5, 64]} />
        <meshBasicMaterial color="#00c8ff" transparent opacity={0.28} toneMapped={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.02, 0]}>
        <ringGeometry args={[1.8, 1.85, 64]} />
        <meshBasicMaterial color="#d4a843" transparent opacity={0.18} toneMapped={false} />
      </mesh>
    </>
  )
}

function StadiumLights() {
  return (
    <>
      <pointLight position={[3, 4, 3]} intensity={8} color="#ffffff" distance={15} />
      <pointLight position={[-3, 4, 3]} intensity={6} color="#00c8ff" distance={15} />
      <pointLight position={[0, 4, -4]} intensity={6} color="#d4a843" distance={15} />
      <pointLight position={[3, -1, -2]} intensity={3} color="#1a8a3e" distance={8} />
      <pointLight position={[-3, -1, -2]} intensity={3} color="#00c8ff" distance={8} />
    </>
  )
}

function CinematicRig() {
  const { camera, mouse } = useThree()
  const target = useMemo(() => new THREE.Vector3(0, 0.1, 0), [])

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    const baseX = Math.sin(elapsed * 0.15) * 0.6
    const baseY = 1.1 + Math.sin(elapsed * 0.2) * 0.15
    const baseZ = 3.6

    const mouseX = mouse.x * 0.5
    const mouseY = mouse.y * 0.25

    camera.position.x += (baseX + mouseX - camera.position.x) * 0.05
    camera.position.y += (baseY + mouseY - camera.position.y) * 0.05
    camera.position.z += (baseZ - camera.position.z) * 0.05
    camera.lookAt(target)
  })

  return null
}

function Scene({ onReady }: { onReady?: () => void }) {
  return (
    <>
      <color attach="background" args={['#020608']} />
      <fog attach="fog" args={['#020608', 8, 20]} />
      <ambientLight intensity={0.5} />
      <StadiumLights />

      <Suspense fallback={null}>
        <Football />
        <ReadySignal onReady={onReady} />
      </Suspense>

      <Ground />
      <Environment preset="night" />
      <CinematicRig />
    </>
  )
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    if (!onReady) return
    const id = requestAnimationFrame(() => onReady())
    return () => cancelAnimationFrame(id)
  }, [onReady])
  return null
}

export default function FootballScene() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('fifa:ball-ready'))
  }, [ready])

  return (
    <div className="absolute inset-0 z-0 bg-[#020608]">
      {/* Pre-load ambient: slow conic sweep + radial halo + faint pitch grid. Fades out when ball is ready. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-[1400ms] ease-out ${
          ready ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(0,200,255,0.10), rgba(212,168,67,0.08), rgba(26,138,62,0.10), rgba(0,200,255,0.10))',
            filter: 'blur(80px)',
            animation: 'fbConicSpin 18s linear infinite',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(0,200,255,0.18) 0%, rgba(2,6,8,0) 55%), radial-gradient(ellipse at 50% 95%, rgba(212,168,67,0.14) 0%, rgba(2,6,8,0) 60%)',
            animation: 'fbHaloPulse 3.6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f0f4f8 1px, transparent 1px), linear-gradient(to bottom, #f0f4f8 1px, transparent 1px)',
            backgroundSize: '120px 120px',
            maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[28vmin] w-[28vmin] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              'radial-gradient(circle, rgba(240,244,248,0.18) 0%, rgba(2,6,8,0) 60%)',
            animation: 'fbHaloPulse 2.4s ease-in-out infinite',
            filter: 'blur(8px)',
          }}
        />
      </div>

      <div
        className={`absolute inset-0 transition-[opacity,filter,transform] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          ready
            ? 'opacity-100 blur-0 scale-100'
            : 'opacity-0 blur-2xl scale-[1.06]'
        }`}
        style={{ willChange: 'opacity, filter, transform' }}
      >
        <Canvas
          camera={{ position: [0, 1.2, 4], fov: 40 }}
          gl={{
            antialias: true,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          dpr={[1, 2]}
          shadows
        >
          <Scene onReady={() => setReady(true)} />
        </Canvas>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 90%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      <style jsx>{`
        @keyframes fbConicSpin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes fbHaloPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

useGLTF.preload('/models/football/scene.gltf')