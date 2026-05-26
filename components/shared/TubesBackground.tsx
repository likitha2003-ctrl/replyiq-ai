'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';

// Helper for random colors
const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

const TUBES_CDN = 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js';

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({ 
  children, 
  className = "",
  enableClickInteraction = true 
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tubesRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Give the canvas a unique ID so the inline module script can find it
    const canvasId = 'tubes-canvas-' + Math.random().toString(36).slice(2, 9);
    canvas.id = canvasId;

    // Use a unique window key for this instance
    const windowKey = '__tubesApp_' + canvasId;

    // Create a <script type="module"> that natively loads the ES module via browser's module system
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import TubesCursor from '${TUBES_CDN}';
      const canvas = document.getElementById('${canvasId}');
      if (canvas) {
        const app = TubesCursor(canvas, {
          tubes: {
            colors: ["#7c3aed", "#06b6d4", "#a855f7"],
            lights: {
              intensity: 200,
              colors: ["#7c3aed", "#06b6d4", "#f43f5e", "#10b981"]
            }
          }
        });
        window['${windowKey}'] = app;
        canvas.dispatchEvent(new CustomEvent('tubes-ready'));
      }
    `;

    const onReady = () => {
      if (!mounted) return;
      tubesRef.current = (window as any)[windowKey];
      setIsLoaded(true);
    };

    canvas.addEventListener('tubes-ready', onReady);
    document.head.appendChild(script);

    return () => {
      mounted = false;
      canvas.removeEventListener('tubes-ready', onReady);
      // Clean up the window reference
      delete (window as any)[windowKey];
      // Remove the script tag
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    try {
      const colors = randomColors(3);
      const lightsColors = randomColors(4);
      tubesRef.current.tubes.setColors(colors);
      tubesRef.current.tubes.setLightsColors(lightsColors);
    } catch (e) {
      // Silently fail if the API isn't available
    }
  }, [enableClickInteraction]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[400px] overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {/* 3D Canvas layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
