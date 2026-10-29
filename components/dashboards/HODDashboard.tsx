'use client'

import { ArrowUpRight, BookOpen, CalendarDays, ClipboardCheck, FileText, GraduationCap, Users } from 'lucide-react'
import {
  DashboardAction,
  DashboardEmptyState,
  DashboardMetric,
  DashboardPanel,
  WorkspacePreview,
} from '@/components/dashboards/dashboard-primitives'
import { useAuth } from '@/lib/auth-context'
import { mockAssignments, mockFaculty, mockSubjects, mockTimetable, mockUsers } from '@/lib/mock-data'

export function HODDashboard() {
  const { currentUser, setActiveTab } = useAuth()
  const department = currentUser.department || mockUsers.HOD.department
  const departmentFaculty = mockFaculty.filter((person) => person.department === department)
  const departmentSubjects = mockSubjects.filter((subject) => subject.department === department)
  const assignedCodes = new Set(departmentSubjects.map((subject) => subject.code))
  const departmentAssignments = mockAssignments.filter((assignment) =>
    assignedCodes.has(assignment.subjectCode)
  )
  const today = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(new Date())
  const departmentSchedule = mockTimetable.filter(
    (slot) => slot.day === today && departmentSubjects.some((subject) => subject.code === slot.subjectCode)
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="grid gap-5 rounded-2xl bg-[#152a55] p-5 text-white sm:p-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
            Department operations
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Plan the work. Support the people.</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100/80">{department}</p>
          <WorkspacePreview />
        </div>
        <div className="grid grid-cols-2 gap-3 self-end">
          <DashboardMetric
            icon={GraduationCap}
            label="Faculty records"
            value={departmentFaculty.length}
            detail="Assigned to this department"
            tone="navy"
          />
          <DashboardMetric
            icon={BookOpen}
            label="Subjects"
            value={departmentSubjects.length}
            detail="In the current course list"
            tone="blue"
          />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <div className="space-y-5">
          <DashboardPanel
            eyebrow="Faculty workload"
            title="Teaching allocation"
            description="Workload and subject assignments from the current faculty directory."
            action={
              <button
                onClick={() => setActiveTab('Faculty')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                Faculty directory
              </button>
            }
          >
            {departmentFaculty.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      <th className="py-2.5 pr-3">Faculty member</th>
                      <th className="px-3 py-2.5">Assigned subjects</th>
                      <th className="px-3 py-2.5">Weekly hours</th>
                      <th className="py-2.5 pl-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departmentFaculty.map((person) => (
                      <tr key={person.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-slate-800">{person.name}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{person.designation}</p>
                        </td>
                        <td className="px-3 py-3 text-slate-600">{person.subjects.length}</td>
                        <td className="px-3 py-3 text-slate-600">{person.workloadHours} hrs</td>
                        <td className="py-3 pl-3 text-right">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                              person.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {person.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <DashboardEmptyState
                title="No faculty records for this department"
                description="Faculty assignments will appear here when available."
              />
            )}
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Academic planning"
            title="Current course coverage"
            description="Subjects currently listed under the department."
            action={
              <button
                onClick={() => setActiveTab('Subjects')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                Course catalogue
              </button>
            }
          >
            {departmentSubjects.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {departmentSubjects.slice(0, 6).map((subject) => (
                  <div
                    key={subject.id}
                    className="rounded-xl border border-slate-100 bg-[#fbfcfe] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold tracking-wide text-[#3571c9]">
                        {subject.code}
                      </span>
                      <span className="text-[10px] text-slate-500">{subject.credits} credits</span>
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-slate-800">{subject.name}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {subject.semester} · {subject.facultyName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                title="No courses listed"
                description="Course information will appear when it is available in the department catalogue."
              />
            )}
          </DashboardPanel>
        </div>

        <div className="space-y-5">
          <DashboardPanel
            eyebrow="Today"
            title="Department timetable"
            description={`${today} sessions found in the current timetable.`}
            action={
              <button
                onClick={() => setActiveTab('Timetable')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                Open timetable
              </button>
            }
          >
            {departmentSchedule.length ? (
              <div className="space-y-2.5">
                {departmentSchedule.map((slot) => (
                  <div key={slot.id} className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#1b4d9b]">{slot.startTime}</span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                        {slot.section}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-slate-800">{slot.subjectName}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {slot.facultyName} · {slot.room}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                title="No sessions listed today"
                description="Use the full timetable to review upcoming department sessions."
              />
            )}
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Department links"
            title="Planning & reporting"
            description={`${departmentAssignments.length} assignment records are linked to listed department subjects.`}
          >
            <div className="space-y-2">
              <DashboardAction
                icon={ClipboardCheck}
                title="Attendance analytics"
                description="Review monthly attendance summaries"
                onClick={() => setActiveTab('Attendance analytics')}
              />
              <DashboardAction
                icon={CalendarDays}
                title="Timetable"
                description="Review classes and schedules"
                onClick={() => setActiveTab('Timetable')}
              />
              <DashboardAction
                icon={FileText}
                title="Academic reports"
                description="Open department reporting"
                onClick={() => setActiveTab('Reports')}
              />
            </div>
          </DashboardPanel>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setActiveTab('Reports')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1b4d9b] hover:underline"
        >
          View all department reports <ArrowUpRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
