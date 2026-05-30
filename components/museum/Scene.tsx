'use client'
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Stars, Line } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ROOMS } from './Museum'
import Lobby from './rooms/Lobby'
import LeadScoring from './rooms/LeadScoring'
import SentimentLab from './rooms/SentimentLab'
import SalesCommand from './rooms/SalesCommand'
import WorkflowFactory from './rooms/WorkflowFactory'
import ChurnVault from './rooms/ChurnVault'
import MultiTenant from './rooms/MultiTenant'
import Nexus from './rooms/Nexus'

interface SceneProps {
  currentRoom: number
  transitioning: boolean
  rooms: typeof ROOMS
}

function CameraRig({ currentRoom, rooms }: { currentRoom: number, rooms: typeof ROOMS }) {
  const { camera } = useThree()

  useEffect(() => {
    const room = rooms[currentRoom]
    const targetZ = room.z + 10  

    gsap.to(camera as any, {
      fov: 80,
      duration: 0.5,
      ease: 'power2.in',
      onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
      onComplete: () => {
        gsap.to(camera as any, {
          fov: 60,
          duration: 0.9,
          ease: 'power2.out',
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix()
        })
      }
    })

    gsap.to(camera.position, {
      z: targetZ,
      y: 1.5,
      x: 0,
      duration: 1.8,
      ease: 'power3.inOut'
    })

    gsap.to(camera.rotation, {
      x: currentRoom > 0 ? -0.04 : 0,
      duration: 0.9,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 1
    })
  }, [currentRoom, camera, rooms])

  return null
}

function Corridor() {
  return (
    <group>
      <gridHelper
        args={[20, 20, '#7C3AED', '#7C3AED']}
        position={[0, -4, -125]}
        rotation={[0, 0, 0]}
      />
      // @ts-ignore      <Line points={[[-4, -3, 5], [-4, -3, -255]]} color="#7C3AED" lineWidth={0.5} opacity={0.15} transparent />
      // @ts-ignore      <Line points={[[4, -3, 5], [4, -3, -255]]} color="#7C3AED" lineWidth={0.5} opacity={0.15} transparent />
      // @ts-ignore      <Line points={[[-4, 5, 5], [-4, 5, -255]]} color="#7C3AED" lineWidth={0.3} opacity={0.08} transparent />
      // @ts-ignore      <Line points={[[4, 5, 5], [4, 5, -255]]} color="#7C3AED" lineWidth={0.3} opacity={0.08} transparent />
    </group>
  )
}

export function Scene({ currentRoom, rooms }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.05} />
      <fog attach="fog" args={['#000000', 30, 120]} />

      <CameraRig currentRoom={currentRoom} rooms={rooms} />

      <Stars radius={200} depth={60} count={3000} factor={3} saturation={0} fade speed={0.5} />
      <Corridor />

      {rooms.map((room, i) => {
        if (Math.abs(i - currentRoom) > 3) return null
        const isActive = i === currentRoom
        switch(i) {
          case 0: return <Lobby key={i} position={[0, 0, room.z]} active={isActive} />
          case 1: return <LeadScoring key={i} position={[0, 0, room.z]} active={isActive} />
          case 2: return <SentimentLab key={i} position={[0, 0, room.z]} active={isActive} />
          case 3: return <SalesCommand key={i} position={[0, 0, room.z]} active={isActive} />
          case 4: return <WorkflowFactory key={i} position={[0, 0, room.z]} active={isActive} />
          case 5: return <ChurnVault key={i} position={[0, 0, room.z]} active={isActive} />
          case 6: return <MultiTenant key={i} position={[0, 0, room.z]} active={isActive} />
          case 7: return <Nexus key={i} position={[0, 0, room.z]} active={isActive} />
          default: return null
        }
      })}
    </>
  )
}
