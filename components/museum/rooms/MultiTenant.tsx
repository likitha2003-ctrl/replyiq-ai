'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sparkles, Line } from '@react-three/drei'
import * as THREE from 'three'

interface RoomProps {
  position: [number, number, number]
  active: boolean
}

export default function MultiTenant({ position, active }: RoomProps) {
  const hubRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (hubRef.current) {
      hubRef.current.rotation.x += 0.002
      hubRef.current.rotation.y += 0.003
    }
  })

  const tenants = [
    { name: "Spice Garden", color: "#7C3AED", r: 0.8, orbit: 5, speed: 0.004, y: 0 },
    { name: "TechFlow", color: "#3B82F6", r: 0.7, orbit: 6, speed: 0.003, y: 1.5 },
    { name: "Bloom Boutique", color: "#F97316", r: 0.6, orbit: 4.5, speed: 0.005, y: -1 }
  ]

  return (
    <group position={position}>
      <mesh ref={hubRef} position={[0, 0, -5]}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial color="#10B981" wireframe />
      </mesh>

      {tenants.map((t, i) => (
        <group key={i} position={[0, 0, -5]}>
          <mesh rotation={[Math.PI/2, 0, 0]} position={[0, t.y, 0]}>
            <torusGeometry args={[t.orbit, 0.01, 16, 100]} />
            <meshBasicMaterial color={t.color} transparent opacity={0.12} />
          </mesh>
          <TenantOrbiter tenant={t} />
        </group>
      ))}

      <pointLight position={[0, 0, -5]} color="#10B981" intensity={6} />
    </group>
  )
}

function TenantOrbiter({ tenant }: { tenant: any }) {
  const ref = useRef<THREE.Group>(null)
  const lineRef = useRef<any>(null)
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * tenant.speed * 100
      const x = Math.cos(t) * tenant.orbit
      const z = Math.sin(t) * tenant.orbit
      
      ref.current.position.set(x, tenant.y, z)

      if (lineRef.current) {
        const positions = lineRef.current.geometry.attributes.position.array
        positions[0] = 0; positions[1] = 0; positions[2] = 0;
        positions[3] = x; positions[4] = tenant.y; positions[5] = z;
        lineRef.current.geometry.attributes.position.needsUpdate = true
      }
    }
  })

  const lineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)])

  return (
    <>
      {/* @ts-ignore */}
      <line ref={lineRef as any} geometry={lineGeom}>
        <lineBasicMaterial color={tenant.color} transparent opacity={0.3} />
      </line>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[tenant.r, 16, 16]} />
          <meshBasicMaterial color={tenant.color} />
        </mesh>
        <Sparkles count={20} scale={2} color={tenant.color} size={1} />
        <Text position={[0, tenant.r + 0.5, 0]} fontSize={0.22} color={tenant.color}>
          {tenant.name}
        </Text>
      </group>
    </>
  )
}
