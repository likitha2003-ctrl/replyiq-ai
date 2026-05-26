import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex w-full rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
          {
            "border-rose-500 focus:ring-rose-500 focus:border-rose-500": error,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
export { Input };
