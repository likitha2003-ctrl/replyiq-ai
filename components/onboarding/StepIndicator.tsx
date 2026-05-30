import React from 'react';
import { cn } from '../../lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-3">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={idx} className="flex items-center">
            {/* Step circle */}
            <div
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300",
                {
                  "bg-zinc-600 border-zinc-500 text-white shadow-lg shadow-zinc-500/20": isActive,
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400": isCompleted,
                  "bg-zinc-900 border-white/10 text-zinc-500": !isActive && !isCompleted,
                }
              )}
            >
              {isCompleted ? '✓' : stepNum}
            </div>
            
            {/* Connecting line */}
            {stepNum < totalSteps && (
              <div
                className={cn("h-0.5 w-10 transition-all duration-500 ml-3", {
                  "bg-emerald-500/30": isCompleted,
                  "bg-zinc-800": !isCompleted,
                })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
