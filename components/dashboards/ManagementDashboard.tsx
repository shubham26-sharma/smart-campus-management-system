'use client'

import { ArrowUpRight, BarChart3, Building2, ClipboardCheck, FileText, GraduationCap, Users } from 'lucide-react'
import {
  DashboardAction,
  DashboardEmptyState,
  DashboardMetric,
  DashboardPanel,
  WorkspacePreview,
  formatDashboardDate,
} from '@/components/dashboards/dashboard-primitives'
import { useAuth } from '@/lib/auth-context'
import { mockDepartments, mockNotices, mockStudents } from '@/lib/mock-data'

export function ManagementDashboard() {
  const { setActiveTab } = useAuth()
  const maxEnrollment = Math.max(...mockDepartments.map((department) => department.studentCount), 1)

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="grid gap-6 overflow-hidden rounded-2xl border border-[#dce4f0] bg-white lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
        <div className="p-5 sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3571c9]">
            Institutional briefing
          </p>
          <h2 className="mt-2 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-[#152a55] sm:text-3xl">
            A clearer view of the academic year.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            Review departmental scale, follow campus communications, and open the reports behind each decision.
          </p>
          <WorkspacePreview />
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('Reports')}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1b4d9b] px-4 text-xs font-semibold text-white hover:bg-[#153e7e]"
            >
              Open reports <ArrowUpRight className="size-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('Departments')}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Department directory
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-[#f5f8fc] p-5 sm:p-6">
          <DashboardMetric
            icon={Building2}
            label="Departments"
            value={mockDepartments.length}
            detail="Listed in the workspace"
            tone="navy"
          />
          <DashboardMetric
            icon={Users}
            label="Student records"
            value={mockStudents.length}
            detail="Visible in the sample directory"
            tone="blue"
          />
          <div className="col-span-2 rounded-xl border border-dashed border-slate-300 bg-white/70 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Institution-wide monthly attendance
            </p>
            <p className="mt-1 text-lg font-bold text-slate-700">N/A</p>
            <p className="text-[11px] text-slate-500">
              A consolidated management summary is not available in the current data.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <DashboardPanel
          eyebrow="Institution profile"
          title="Department footprint"
          description="Compare the roster sizes and faculty counts available in the department directory."
          action={
            <button
              onClick={() => setActiveTab('Departments')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              View directory
            </button>
          }
        >
          {mockDepartments.length ? (
            <div className="space-y-4">
              {mockDepartments.map((department) => (
                <article
                  key={department.id}
                  className="grid gap-3 sm:grid-cols-[minmax(155px,0.8fr)_minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-800">{department.name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {department.code} · HOD {department.hodName}
                    </p>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[10px] text-slate-500">
                      <span>{department.studentCount} students</span>
                      <span>{department.facultyCount} faculty</span>
                    </div>
                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                      role="img"
                      aria-label={`${department.studentCount} students in ${department.name}`}
                    >
                      <div
                        className="h-full rounded-full bg-[#3571c9]"
                        style={{
                          width: `${Math.min(100, (department.studentCount / maxEnrollment) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="justify-self-start rounded-full bg-[#eef4ff] px-2.5 py-1 text-[10px] font-semibold text-[#1b4d9b] sm:justify-self-end">
                    {department.activePrograms.length} programs
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No departments available"
              description="Department records will appear here when available."
            />
          )}
        </DashboardPanel>

        <DashboardPanel
          eyebrow="Institutional communication"
          title="Recent notices"
          description="A quick read of the latest campus circulars."
          action={
            <button
              onClick={() => setActiveTab('Notices')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              Notice centre
            </button>
          }
        >
          {mockNotices.length ? (
            <div className="space-y-4">
              {mockNotices.slice(0, 3).map((notice) => (
                <article
                  key={notice.id}
                  className="border-l-2 border-[#3571c9] pl-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#1b4d9b]">
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
                </article>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title="No recent notices"
              description="New institutional communications will appear here."
            />
          )}
        </DashboardPanel>
      </div>

      <section className="grid gap-5 sm:grid-cols-3">
        <DashboardAction
          icon={BarChart3}
          title="Academic reports"
          description="Open available institutional reports"
          onClick={() => setActiveTab('Reports')}
        />
        <DashboardAction
          icon={GraduationCap}
          title="Department planning"
          description="Review academic structure and programs"
          onClick={() => setActiveTab('Departments')}
        />
        <DashboardAction
          icon={ClipboardCheck}
          title="Attendance overview"
          description="Review available attendance summaries"
          onClick={() => setActiveTab('Analytics')}
        />
      </section>
      <p className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
        <FileText className="size-3" aria-hidden="true" />
        Published date labels reflect the available notice records.
      </p>
    </div>
  )
}
