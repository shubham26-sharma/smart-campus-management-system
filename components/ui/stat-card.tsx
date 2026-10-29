import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  className?: string
  subtitle?: string
}

export function StatCard({
  label,
  value,
  change,
  trend = 'up',
  icon: Icon,
  className,
  subtitle,
}: StatCardProps) {
  const trendBg =
    trend === 'up'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      : trend === 'down'
      ? 'bg-rose-50 text-rose-700 border border-rose-100'
      : 'bg-slate-100 text-slate-600 border border-slate-200'

  return (
    <div
      className={cn(
        'rounded-2xl border border-[#e5eaf1] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(16,24,40,0.07)]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#1b4d9b]">
          <Icon className="size-[19px]" aria-hidden="true" />
        </div>
        {change && (
          <span className={cn('rounded-full px-2 py-1 text-[10px] font-bold', trendBg)}>
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-[26px] font-bold leading-tight tracking-tight text-[#182230]">
        {value}
      </p>
      {subtitle && <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}
