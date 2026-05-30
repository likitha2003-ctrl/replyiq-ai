'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface RoomProps {
  position: [number, number, number]
  active: boolean
}

export default function LeadScoring({ position, active }: RoomProps) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (outerRef.current) outerRef.current.rotation.y += 0.004
    if (innerRef.current) innerRef.current.rotation.y -= 0.006
  })

  const spheres = [
    { color: '#3B82F6', speed: 1.2, offset: 0 },
    { color: '#7C3AED', speed: 0.8, offset: 1 },
    { color: '#10B981', speed: 1.5, offset: 2 },
    { color: '#F59E0B', speed: 0.9, offset: 3 },
    { color: '#EF4444', speed: 1.1, offset: 4 }
  ]

  return (
    <group position={position}>
      <mesh ref={outerRef} position={[0, 0, -3]}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshBasicMaterial color="#3B82F6" />
      </mesh>
      
      <mesh ref={innerRef} position={[0, 0, -3]} rotation={[Math.PI/3, 0, 0]}>
        <torusGeometry args={[1.8, 0.04, 16, 100]} />
        <meshBasicMaterial color="#7C3AED" />
      </mesh>

      <Text position={[0, 0.2, -3]} fontSize={2.5} color="white">87</Text>
      <Text position={[0, -1.2, -3]} fontSize={0.4} color="#3B82F6">AI SCORE</Text>

      {spheres.map((s, i) => (
        <OrbitingSphere key={i} color={s.color} speed={s.speed} offset={s.offset} zOffset={-3} />
      ))}

      <group position={[0, -2.5, -3]}>
        {[0.91, 0.78, 0.84, 0.72].map((h, i) => (
          <mesh key={i} position={[(i - 1.5) * 0.5, h * 1.5 / 2, 0]}>
            <boxGeometry args={[0.3, h * 3, 0.3]} />
            <meshBasicMaterial color={['#7C3AED', '#3B82F6', '#10B981', '#F59E0B'][i]} />
          </mesh>
        ))}
      </group>

      <pointLight position={[0, 2, -2]} color="#3B82F6" intensity={7} />
    </group>
  )
}

function OrbitingSphere({ color, speed, offset, zOffset }: { color: string, speed: number, offset: number, zOffset: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.x = Math.cos(t * speed + offset) * 4.5
      ref.current.position.y = Math.sin(t * 0.3 + offset) * 0.8
      ref.current.position.z = zOffset + Math.sin(t * speed + offset) * 4.5
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}
