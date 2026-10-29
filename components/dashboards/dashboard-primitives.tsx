import type { LucideIcon } from 'lucide-react'
import { DataSourceIndicator } from '@/components/ui/data-source-indicator'

export function DashboardPanel({
  eyebrow,
  title,
  description,
  action,
  children,
  className = '',
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-2xl border border-[#e5eaf1] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6 ${className}`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          {eyebrow && (
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#3571c9]">
              {eyebrow}
            </p>
          )}
          <h2 className="text-sm font-bold tracking-tight text-[#182230]">{title}</h2>
          {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function DashboardMetric({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'blue',
}: {
  label: string
  value: string | number
  detail: string
  icon: LucideIcon
  tone?: 'blue' | 'teal' | 'amber' | 'navy'
}) {
  const tones = {
    blue: 'bg-blue-50 text-[#1b4d9b]',
    teal: 'bg-teal-50 text-teal-700',
    amber: 'bg-amber-50 text-amber-800',
    navy: 'bg-[#eef1f7] text-[#152a55]',
  }

  return (
    <div className="flex min-w-0 items-start gap-3 border-l-2 border-[#e5eaf1] py-1 pl-4">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="size-[17px]" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xl font-bold tracking-tight text-[#182230]">{value}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{detail}</p>
      </div>
    </div>
  )
}

export function DashboardAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: LucideIcon
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-blue-200 hover:bg-[#f8faff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3571c9]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eef4ff] text-[#1b4d9b] transition-colors group-hover:bg-[#e3edff]">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-slate-800">{title}</span>
        <span className="mt-0.5 block truncate text-[11px] text-slate-500">{description}</span>
      </span>
    </button>
  )
}

export function DashboardEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-8 text-center">
      <p className="text-xs font-semibold text-slate-700">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  )
}

export function WorkspacePreview() {
  return <DataSourceIndicator className="mt-2" />
}

export function formatDashboardDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date)
}
