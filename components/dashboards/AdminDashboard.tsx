'use client'

import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  MessageSquare,
  Settings2,
  Users,
  WalletCards,
} from 'lucide-react'
import {
  DashboardAction,
  DashboardEmptyState,
  DashboardMetric,
  DashboardPanel,
  WorkspacePreview,
  formatDashboardDate,
} from '@/components/dashboards/dashboard-primitives'
import { useAuth } from '@/lib/auth-context'
import { mockComplaints, mockDepartments, mockFaculty, mockNotices, mockStudents } from '@/lib/mock-data'

const operations = [
  {
    label: 'Students',
    detail: 'Student directory and records',
    icon: Users,
    tab: 'Students',
  },
  {
    label: 'Faculty',
    detail: 'Faculty profiles and subject links',
    icon: GraduationCap,
    tab: 'Faculty',
  },
  {
    label: 'Academic structure',
    detail: 'Departments, classes, and subjects',
    icon: Building2,
    tab: 'Departments',
  },
  {
    label: 'Timetable',
    detail: 'Class schedules and allocations',
    icon: CalendarDays,
    tab: 'Timetable',
  },
  {
    label: 'Notices',
    detail: 'Campus announcements and notices',
    icon: Bell,
    tab: 'Notices',
  },
  {
    label: 'Fees',
    detail: 'Fee records and payment status',
    icon: WalletCards,
    tab: 'Fee records',
  },
]

export function AdminDashboard() {
  const { setActiveTab } = useAuth()
  const urgentComplaints = mockComplaints
    .filter((complaint) => complaint.priority === 'Urgent' && complaint.status !== 'Resolved')
    .slice(0, 3)
  const currentNotices = mockNotices.slice(0, 3)

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#e5eaf1] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3571c9]">
            Administrative office
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#152a55]">
            Operations at a glance
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Get to the records and campus services that need day-to-day attention.
          </p>
          <WorkspacePreview />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:min-w-[360px]">
          <DashboardMetric
            icon={Users}
            label="Student records"
            value={mockStudents.length}
            detail="Records in directory"
            tone="navy"
          />
          <DashboardMetric
            icon={GraduationCap}
            label="Faculty records"
            value={mockFaculty.length}
            detail="Records in directory"
            tone="blue"
          />
        </div>
      </section>

      <DashboardPanel
        eyebrow="Operations directory"
        title="Administrative modules"
        description="Jump directly into existing record-management and campus operations screens."
      >
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {operations.map((item) => (
            <DashboardAction
              key={item.label}
              icon={item.icon}
              title={item.label}
              description={item.detail}
              onClick={() => setActiveTab(item.tab)}
            />
          ))}
        </div>
      </DashboardPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardPanel
          eyebrow="Attention queue"
          title="Urgent complaints"
          description="High-priority, unresolved items in the current complaint records."
          action={
            <button
              onClick={() => setActiveTab('Complaints')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              Open queue <ArrowUpRight className="size-3.5" />
            </button>
          }
        >
          {urgentComplaints.length ? (
            <div className="divide-y divide-slate-100">
              {urgentComplaints.map((complaint) => (
                <article key={complaint.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      {complaint.ticketId}
                    </span>
                    <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-800">
                      {complaint.priority}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xs font-semibold text-slate-800">{complaint.subject}</h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {complaint.category} · {complaint.status}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No urgent open complaints"
              description="There are no urgent unresolved items in the current records."
            />
          )}
        </DashboardPanel>

        <DashboardPanel
          eyebrow="Campus communications"
          title="Recent notices"
          description={`${mockDepartments.length} departments represented in the directory.`}
          action={
            <button
              onClick={() => setActiveTab('Notices')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              Notice centre
            </button>
          }
        >
          {currentNotices.length ? (
            <div className="space-y-3">
              {currentNotices.map((notice) => (
                <article
                  key={notice.id}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-[#fbfcfe] p-3.5"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1b4d9b]">
                    <Bell className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#3571c9]">
                        {notice.category}
                      </span>
                      <time className="text-[10px] text-slate-400">
                        {formatDashboardDate(notice.publishedDate)}
                      </time>
                    </div>
                    <h3 className="mt-1 text-xs font-semibold leading-relaxed text-slate-800">
                      {notice.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                      {notice.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No notices to display"
              description="Published campus notices will appear here."
            />
          )}
        </DashboardPanel>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('Classes')}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <BookOpen className="size-3.5 text-[#1b4d9b]" /> Academic content
        </button>
        <button
          onClick={() => setActiveTab('Settings')}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Settings2 className="size-3.5 text-[#1b4d9b]" /> Workspace settings
        </button>
        <button
          onClick={() => setActiveTab('Reports')}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <MessageSquare className="size-3.5 text-[#1b4d9b]" /> Reports
        </button>
      </div>
    </div>
  )
}
