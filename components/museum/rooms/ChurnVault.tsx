'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface RoomProps {
  position: [number, number, number]
  active: boolean
}

export default function ChurnVault({ position, active }: RoomProps) {
  const shieldRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const crackAngles = [0, 45, 90, 135, 180, 225, 270, 315].map(a => a * Math.PI / 180)

  useFrame(({ clock }) => {
    if (shieldRef.current) shieldRef.current.rotation.y += 0.002
    if (ringRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * (Math.PI * 2 / 3)) * 0.08
      ringRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group position={position}>
      <group ref={shieldRef} position={[0, 0, -5]}>
        <mesh>
          <cylinderGeometry args={[2.5, 2.5, 4, 6]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.12} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[2.5, 2.5, 4, 6]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.35} wireframe />
        </mesh>
      </group>

      <group position={[0, 0, -5]}>
        {crackAngles.map((angle, i) => (
          <CrackLine key={i} angle={angle} index={i} />
        ))}
      </group>

      {[0, 1, 2].map((i) => (
        <WarningOrbiter key={i} index={i} />
      ))}

      <mesh ref={ringRef} position={[0, 0, -5]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[4.5, 0.03, 16, 100]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.25} />
      </mesh>

      <Text position={[0, 3.5, -5]} fontSize={0.5} color="#EF4444">73% CHURN RISK</Text>
      <Text position={[0, 2.8, -5]} fontSize={0.2} color="#F59E0B">CRITICAL INTERVENTION REQUIRED</Text>

      <pointLight position={[0, 0, -4]} color="#EF4444" intensity={8} />
      <pointLight position={[-3, 2, -7]} color="#10B981" intensity={3} />
    </group>
  )
}

function CrackLine({ angle, index }: { angle: number, index: number }) {
  const ref = useRef<THREE.Line>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      const material = ref.current.material as THREE.LineBasicMaterial
      material.opacity = 0.1 + Math.max(0, Math.sin(clock.getElapsedTime() * 4 + index)) * 0.7
    }
  })
  
  const endX = Math.cos(angle) * 4
  const endY = Math.sin(angle) * 4

  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(endX, endY, 0)
  ])

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#EF4444" transparent opacity={0.1} />
    </line>
  )
}

function WarningOrbiter({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * Math.PI + (index * Math.PI * 2 / 3)
      ref.current.position.x = Math.cos(t) * 3.5
      ref.current.position.z = -5 + Math.sin(t) * 3.5
      ref.current.position.y = Math.sin(t * 2) * 1.5
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="#EF4444" />
    </mesh>
  )
}
