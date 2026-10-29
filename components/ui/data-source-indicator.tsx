export function DataSourceIndicator({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 ${className}`}
      title="This view contains local sample data, not live records."
    >
      Sample data
    </span>
  )
}
