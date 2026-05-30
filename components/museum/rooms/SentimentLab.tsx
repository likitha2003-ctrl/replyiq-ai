'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sparkles, Line } from '@react-three/drei'
import * as THREE from 'three'

interface RoomProps {
  position: [number, number, number]
  active: boolean
}

export default function SentimentLab({ position, active }: RoomProps) {
  const brainRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (brainRef.current) brainRef.current.rotation.y += 0.002
  })

  const nodes = useMemo(() => [
    { label: "POSITIVE", color: "#10B981", pos: [3, 2, -3], pct: "+67%" },
    { label: "NEGATIVE", color: "#EF4444", pos: [-3, -1, -4], pct: "12" },
    { label: "NEUTRAL",  color: "#6B7280", pos: [2, -2, -2], pct: "40%" },
    { label: "URGENT",   color: "#F59E0B", pos: [-2, 2.5, -3], pct: "5" },
    { label: "HAPPY",    color: "#06B6D4", pos: [0, 3, -5], pct: "94%" },
  ], [])

  return (
    <group position={position}>
      <group ref={brainRef} position={[0, 0, -3]}>
        <mesh>
          <icosahedronGeometry args={[2, 2]} />
          <meshPhongMaterial color="#8B5CF6" transparent opacity={0.7} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[2.2, 2]} />
          <meshBasicMaterial color="#C4B5FD" wireframe transparent opacity={0.4} />
        </mesh>
      </group>

      {nodes.map((node, i) => (
        <group key={i}>
          <AnimatedLine start={[0, 0, -3]} end={node.pos as [number, number, number]} color={node.color} delay={i} />
          
          <FloatSphere position={node.pos as [number, number, number]} color={node.color} speed={1 + i*0.2} />
          
          <Text position={[node.pos[0], node.pos[1] - 0.5, node.pos[2]]} fontSize={0.2} color="rgba(255,255,255,0.5)">
            {node.pct} {node.label}
          </Text>
        </group>
      ))}

      <pointLight position={[0, 2, 0]} color="#8B5CF6" intensity={6} />
    </group>
  )
}

function FloatSphere({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * speed) * 0.2
  })
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Sparkles count={15} scale={1} size={1} color={color} />
    </group>
  )
}

function AnimatedLine({ start, end, color, delay }: { start: [number, number, number], end: [number, number, number], color: string, delay: number }) {
  const ref = useRef<any>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.1 + Math.max(0, Math.sin(clock.getElapsedTime() * 2 + delay)) * 0.5
    }
  })
  return <Line ref={ref} points={[start, end]} color={color} lineWidth={1.5} transparent opacity={0.1} />
}
