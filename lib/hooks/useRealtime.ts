import { useEffect, useState, useCallback, useRef } from 'react';
import { simulateIncomingMessage } from '../simulator/messageSimulator';

export function useRealtime() {
  const [isSimulating, setIsSimulating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSimulation = useCallback(async () => {
    try {
      const result = await simulateIncomingMessage();
      return result;
    } catch (e) {
      console.error('Error simulating incoming message:', e);
      return null;
    }
  }, []);

  const startSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    // Immediately trigger one simulation
    triggerSimulation();
    
    // Then set interval
    intervalRef.current = setInterval(() => {
      triggerSimulation();
    }, 25000); // every 25s
  }, [isSimulating, triggerSimulation]);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSimulating(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isSimulating,
    startSimulation,
    stopSimulation,
    triggerSimulation,
  };
}
