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
    <div className={cn('rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300', className)}>
      <div className="flex items-start justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#1b4d9b]">
          <Icon className="size-[18px]" />
        </div>
        {change && (
          <span className={cn('rounded-full px-2 py-1 text-[10px] font-bold', trendBg)}>
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {subtitle && <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>}
    </div>
  )
}
