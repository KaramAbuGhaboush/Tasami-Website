'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Float,
  MeshDistortMaterial,
  Sphere,
  Box,
  Torus,
  Environment,
  ContactShadows,
  Text3D,
  useGLTF
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

// AI-themed 3D Components
function AINeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null!)
  
  const nodes = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.2,
    }))
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={node.position} scale={node.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <MeshDistortMaterial
              color={i % 3 === 0 ? "#667eea" : i % 3 === 1 ? "#764ba2" : "#f093fb"}
              attach="material"
              distort={0.2}
              speed={1.5}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function DataParticles() {
  const pointsRef = useRef<THREE.Points>(null!)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    const colors = new Float32Array(2000 * 3)
    
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25
      
      const color = new THREE.Color()
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
          count={particles.positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
          count={particles.colors.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.8} />
    </points>
  )
}

function FloatingElements() {
  const groupRef = useRef<THREE.Group>(null!)
  
  const elements = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: Math.random() * 0.5 + 0.3,
      type: i % 4, // 0: box, 1: sphere, 2: torus, 3: octahedron
    }))
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {elements.map((element, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={element.position} rotation={element.rotation} scale={element.scale}>
            {element.type === 0 && <boxGeometry args={[1, 1, 1]} />}
            {element.type === 1 && <sphereGeometry args={[0.5, 16, 16]} />}
            {element.type === 2 && <torusGeometry args={[0.5, 0.2, 16, 32]} />}
            {element.type === 3 && <octahedronGeometry args={[0.6]} />}
            <meshStandardMaterial
              color={i % 2 === 0 ? "#667eea" : "#764ba2"}
              metalness={0.8}
              roughness={0.2}
              emissive={i % 3 === 0 ? "#667eea" : "#000000"}
              emissiveIntensity={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      {/* AI-themed Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#667eea" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#764ba2" />
      <directionalLight position={[0, 10, 5]} intensity={0.8} />
      
      {/* 3D AI Elements */}
      <AINeuralNetwork />
      <DataParticles />
      <FloatingElements />
      
      {/* Environment and Shadows */}
      <Environment preset="city" />
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.2} 
        scale={20} 
        blur={1.5} 
        far={4.5} 
      />
      
      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.9} />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </>
  )
}

export default function AIHero() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={true}
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}
