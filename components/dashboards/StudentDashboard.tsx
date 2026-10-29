'use client'

import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  MapPin,
  Megaphone,
} from 'lucide-react'
import { DashboardAction, DashboardEmptyState, DashboardPanel, WorkspacePreview, formatDashboardDate } from '@/components/dashboards/dashboard-primitives'
import { useAuth } from '@/lib/auth-context'
import { canViewNotice } from '@/lib/notice-visibility'
import {
  mockAssignments,
  mockDepartments,
  mockNotices,
  mockStudentAttendanceBreakdown,
  mockStudents,
  mockSubmissions,
  mockTimetable,
} from '@/lib/mock-data'

export function StudentDashboard() {
  const { currentUser, setActiveTab } = useAuth()
  const student =
    mockStudents.find((item) => item.rollNumber === currentUser.rollNumber) ?? mockStudents[0]
  const today = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(new Date())
  const todayKey = new Date().toLocaleDateString('en-CA')
  const departmentCode = mockDepartments.find((item) => item.name === student.department)?.code
  const classSection = departmentCode
    ? `${departmentCode}-${student.semester.replace(/^Semester\s+/i, '')}${student.section}`
    : ''
  const todayClasses = mockTimetable.filter(
    (slot) => slot.day === today && slot.section === classSection
  )
  const assignments = mockAssignments
    .filter((item) => item.status === 'Published' && item.className.includes(`Sec ${student.section}`))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const submittedIds = new Set(
    mockSubmissions
      .filter((submission) => submission.studentId === student.id)
      .map((submission) => submission.assignmentId)
  )
  const attendance = mockStudentAttendanceBreakdown.reduce(
    (totals, subject) => ({
      attended: totals.attended + subject.classesAttended,
      conducted: totals.conducted + subject.classesConducted,
    }),
    { attended: 0, conducted: 0 }
  )
  const attendancePercentage =
    attendance.conducted > 0 ? (attendance.attended / attendance.conducted) * 100 : null
  const notices = mockNotices
    .filter(
      (notice) =>
        canViewNotice(notice, 'Student', currentUser.department) &&
        (!notice.expiryDate || notice.expiryDate >= todayKey)
    )
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-[#152a55] px-5 py-6 text-white sm:px-7 sm:py-7">
        <div className="absolute -right-10 -top-20 size-64 rounded-full border border-white/10" />
        <div className="absolute -right-2 -top-12 size-48 rounded-full border border-white/10" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              Student workspace · {student.semester}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Good to see you, {currentUser.name.split(' ')[0]}.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100/80">
              Your classes, coursework, and campus updates—together in one place.
            </p>
            <WorkspacePreview />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('Assignments')}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 text-xs font-bold text-[#152a55] transition-colors hover:bg-blue-50"
            >
              Open coursework <ArrowUpRight className="size-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('My timetable')}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/25 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              View timetable
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e5eaf1] bg-white p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Monthly attendance
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#152a55]">
            {attendancePercentage === null ? 'N/A' : `${attendancePercentage.toFixed(1)}%`}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {attendance.conducted > 0
              ? `${attendance.attended} of ${attendance.conducted} classes attended`
              : 'No classes recorded for this month'}
          </p>
          <button
            onClick={() => setActiveTab('My attendance')}
            className="mt-3 text-xs font-semibold text-[#1b4d9b] hover:underline"
          >
            View attendance detail
          </button>
        </div>
        <div className="rounded-2xl border border-[#e5eaf1] bg-white p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Coursework
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#152a55]">
            {assignments.filter((item) => !submittedIds.has(item.id)).length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Published items without a submission record</p>
          <button
            onClick={() => setActiveTab('Assignments')}
            className="mt-3 text-xs font-semibold text-[#1b4d9b] hover:underline"
          >
            Review assignments
          </button>
        </div>
        <div className="rounded-2xl border border-[#e5eaf1] bg-white p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Today&apos;s classes
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#152a55]">
            {todayClasses.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">{today} · {student.semester}</p>
          <button
            onClick={() => setActiveTab('My timetable')}
            className="mt-3 text-xs font-semibold text-[#1b4d9b] hover:underline"
          >
            Open timetable
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
        <div className="space-y-5">
          <DashboardPanel
            eyebrow="Plan your day"
            title={`${today} timetable`}
            description="Your scheduled classes, with room and teaching faculty."
            action={
              <button
                onClick={() => setActiveTab('My timetable')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                Full timetable
              </button>
            }
          >
            {todayClasses.length ? (
              <ol className="space-y-0">
                {todayClasses.map((slot, index) => (
                  <li key={slot.id} className="relative flex gap-4 pb-5 last:pb-0">
                    <div className="flex w-16 shrink-0 flex-col items-end pt-0.5">
                      <span className="text-xs font-bold text-[#152a55]">{slot.startTime}</span>
                      <span className="mt-1 text-[10px] text-slate-500">{slot.endTime}</span>
                    </div>
                    <div className="relative flex min-w-0 flex-1 gap-3 border-l border-slate-200 pl-4">
                      <span
                        className={`absolute -left-[5px] top-1 size-2.5 rounded-full ring-4 ring-white ${
                          index === 0 ? 'bg-[#3571c9]' : 'bg-slate-300'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {slot.subjectName}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                          <span>{slot.subjectCode}</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" /> {slot.room}
                          </span>
                          <span>{slot.facultyName}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <DashboardEmptyState
                title="No classes scheduled today"
                description="Check the weekly timetable for upcoming lectures and labs."
              />
            )}
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Keep coursework moving"
            title="Assignments & due dates"
            description="Published coursework for your class, ordered by due date."
            action={
              <button
                onClick={() => setActiveTab('Assignments')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                All coursework
              </button>
            }
          >
            {assignments.length ? (
              <div className="divide-y divide-slate-100">
                {assignments.slice(0, 4).map((item) => {
                  const submitted = submittedIds.has(item.id)
                  const overdue = item.dueDate < todayKey
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {item.subjectCode} · {item.totalMarks} marks
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock3 className="size-3" /> Due {formatDashboardDate(item.dueDate)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            submitted
                              ? 'bg-emerald-50 text-emerald-700'
                              : overdue
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-blue-50 text-[#1b4d9b]'
                          }`}
                        >
                          {submitted ? 'Submitted' : overdue ? 'Past due' : 'To do'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <DashboardEmptyState
                title="No published assignments"
                description="Published coursework for your class will appear here."
              />
            )}
          </DashboardPanel>
        </div>

        <div className="space-y-5">
          <DashboardPanel
            eyebrow="Campus bulletin"
            title="Notices for students"
            action={
              <button
                onClick={() => setActiveTab('Notices')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                All notices
              </button>
            }
          >
            {notices.length ? (
              <div className="space-y-4">
                {notices.slice(0, 3).map((notice) => (
                  <article key={notice.id} className="border-l-2 border-[#3571c9] pl-3">
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
                title="No current notices"
                description="New campus announcements will appear here."
              />
            )}
          </DashboardPanel>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <DashboardAction
              icon={BookOpen}
              title="Assignments"
              description="Instructions, submissions, and marks"
              onClick={() => setActiveTab('Assignments')}
            />
            <DashboardAction
              icon={GraduationCap}
              title="Exams & results"
              description="Exam schedules and published results"
              onClick={() => setActiveTab('Examinations')}
            />
            <DashboardAction
              icon={Megaphone}
              title="Campus events"
              description="Explore upcoming campus events"
              onClick={() => setActiveTab('Campus events')}
            />
            <DashboardAction
              icon={ClipboardCheck}
              title="Monthly attendance"
              description="Subject summaries and monthly records"
              onClick={() => setActiveTab('My attendance')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
