'use client';
import { createContext, useContext, useState } from 'react';

type RoomContextType = {
  currentRoom: number;
  setCurrentRoom: (room: number) => void;
  isTransitioning: boolean;
  setIsTransitioning: (val: boolean) => void;
};

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  return (
    <RoomContext.Provider value={{ currentRoom, setCurrentRoom, isTransitioning, setIsTransitioning }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext)!;
}
