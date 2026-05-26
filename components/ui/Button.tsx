import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          {
            // Primary
            "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/15 border border-indigo-500/10":
              variant === 'primary',
            // Secondary
            "bg-white/10 hover:bg-white/15 text-white border border-white/5":
              variant === 'secondary',
            // Outline
            "bg-transparent border border-white/10 hover:bg-white/5 hover:border-white/20 text-slate-300 hover:text-white":
              variant === 'outline',
            // Ghost
            "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white":
              variant === 'ghost',
            // Danger
            "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25":
              variant === 'danger',
          },
          {
            "px-3 py-1.5 text-xs": size === 'sm',
            "px-4 py-2 text-sm": size === 'md',
            "px-5 py-2.5 text-base": size === 'lg',
            "p-2": size === 'icon',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { Button };
