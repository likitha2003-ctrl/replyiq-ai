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
                  "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20": isActive,
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400": isCompleted,
                  "bg-slate-900 border-white/10 text-slate-500": !isActive && !isCompleted,
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
                  "bg-slate-800": !isCompleted,
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
