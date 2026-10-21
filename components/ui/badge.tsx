import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' | 'info'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#1b4d9b] text-white',
    secondary: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    destructive: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    outline: 'border border-slate-200 text-slate-600',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}
