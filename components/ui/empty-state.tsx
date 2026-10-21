import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center',
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 rounded-lg bg-[#1b4d9b] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#153e7e] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
