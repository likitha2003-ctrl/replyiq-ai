'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface RoomProps {
  position: [number, number, number]
  active: boolean
}

function useChatTexture(text: string, isAI: boolean) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, 512, 256);
    
    ctx.fillStyle = isAI ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    ctx.roundRect(40, 80, 432, 100, 16);
    ctx.fill();

    ctx.fillStyle = isAI ? '#06B6D4' : '#FFFFFF';
    ctx.font = '24px Inter, sans-serif';
    ctx.fillText(text, 60, 140);
    
    return new THREE.CanvasTexture(canvas);
  }, [text, isAI]);
}

export default function SalesCommand({ position, active }: RoomProps) {
  const brainRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  
  const texUser = useChatTexture("Hi, what are your catering packages?", false)
  const texAI = useChatTexture("Our packages start from ₹850/person...", true)

  useFrame(({ clock }) => {
    if (brainRef.current) {
      brainRef.current.rotation.x += 0.01
      brainRef.current.rotation.y += 0.01
    }
    if (lightRef.current) {
      lightRef.current.intensity = 5 + Math.sin(clock.getElapsedTime() * 3) * 3
    }
  })

  return (
    <group position={position}>
      <mesh position={[-4, 0.5, -5]} rotation={[0, 0.35, 0]}>
        <planeGeometry args={[4.5, 3]} />
        <meshBasicMaterial map={texUser} transparent opacity={0.8} />
      </mesh>
      
      <mesh position={[4, -0.5, -4]} rotation={[0, -0.35, 0]}>
        <planeGeometry args={[4.5, 3]} />
        <meshBasicMaterial map={texAI} transparent opacity={0.8} />
      </mesh>

      <ParticleStream />

      <mesh ref={brainRef} position={[0, 0, -4.5]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#06B6D4" wireframe />
      </mesh>
      <Sparkles position={[0, 0, -4.5]} count={60} color="#06B6D4" size={0.8} scale={3} />

      <Text position={[0, 4, -4]} fontSize={0.3} color="#06B6D4">
        AGENT ACTIVE — 142 conversations handled
      </Text>

      <pointLight ref={lightRef} position={[0, 0, -3]} color="#06B6D4" intensity={7} distance={20} />
    </group>
  )
}

function ParticleStream() {
  const particles = Array.from({length: 30}).map((_, i) => ({
    offset: i / 30 * Math.PI * 2
  }))

  return (
    <group position={[0, 0, -4.5]}>
      {particles.map((p, i) => (
        <StreamParticle key={i} offset={p.offset} />
      ))}
    </group>
  )
}

function StreamParticle({ offset }: { offset: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() * 0.5 + offset) % 1
      ref.current.position.x = -4 + t * 8
      ref.current.position.y = Math.sin(t * Math.PI) * 1.5 - 0.75
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#06B6D4" />
    </mesh>
  )
}
