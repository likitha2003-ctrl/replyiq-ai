'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Sparkles, Text } from '@react-three/drei'
import * as THREE from 'three'

interface RoomProps {
  position: [number, number, number]
  active: boolean
}

export default function WorkflowFactory({ position, active }: RoomProps) {
  const nodes = [
    { pos: [-7, 0, -3], color: '#3B82F6' },
    { pos: [-3.5, 0.5, -5], color: '#F59E0B' },
    { pos: [0, 0, -4], color: '#7C3AED' },
    { pos: [3.5, -0.5, -5], color: '#F59E0B' },
    { pos: [7, 0, -3], color: '#10B981' }
  ]

  return (
    <group position={position}>
      {nodes.map((node, i) => (
        <NodeCube key={i} position={node.pos as [number, number, number]} color={node.color} />
      ))}
      
      {nodes.map((node, i) => i < 4 && (
        <Line key={`line-${i}`} points={[node.pos, nodes[i+1].pos] as any} color={node.color} opacity={0.5} lineWidth={2} transparent />
      ))}

      <group position={[-3.5, -3, -5]}>
        <mesh>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshBasicMaterial color="#6B7280" />
        </mesh>
        <Text position={[0, -0.8, 0]} fontSize={0.3} color="#6B7280">NURTURE</Text>
      </group>
      <Line points={[[-3.5, 0.5, -5], [-3.5, -3, -5]]} color="#F59E0B" opacity={0.5} lineWidth={2} transparent />

      <ExecutionSphere nodes={nodes.map(n => n.pos)} />

      <Sparkles count={40} scale={15} color="#F59E0B" size={0.4} />

      {nodes.map((node, i) => (
        <Line key={`drop-${i}`} points={[node.pos, [node.pos[0], -4, node.pos[2]]] as any} color={node.color} opacity={0.15} transparent />
      ))}
    </group>
  )
}

function NodeCube({ position, color }: { position: [number, number, number], color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.005
      ref.current.rotation.y += 0.005
    }
  })
  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight color={color} intensity={2} distance={10} />
    </group>
  )
}

function ExecutionSphere({ nodes }: { nodes: number[][] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() / 4) % 1
      const index = Math.floor(t * 4)
      const nextIndex = Math.min(index + 1, 4)
      const lerpFactor = (t * 4) - index
      
      const p1 = new THREE.Vector3(...nodes[index])
      const p2 = new THREE.Vector3(...nodes[nextIndex])
      ref.current.position.lerpVectors(p1, p2, lerpFactor)
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  )
}
