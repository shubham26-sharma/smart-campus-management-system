'use client'

import { ArrowRight, BookOpen, CalendarDays, ClipboardCheck, Clock3, MapPin, Users } from 'lucide-react'
import {
  DashboardAction,
  DashboardEmptyState,
  DashboardMetric,
  DashboardPanel,
  WorkspacePreview,
  formatDashboardDate,
} from '@/components/dashboards/dashboard-primitives'
import { useAuth } from '@/lib/auth-context'
import { mockAssignments, mockFaculty, mockSubmissions, mockTimetable } from '@/lib/mock-data'
import { compareTimetableTimes } from '@/lib/timetable-utils'

export function FacultyDashboard() {
  const { currentUser, setActiveTab } = useAuth()
  const faculty = mockFaculty.find((item) => item.name === currentUser.name)
  const taughtCodes = faculty?.subjects.map((subject) => subject.split(' ')[0]) ?? []
  const today = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(new Date())
  const todayClasses = mockTimetable
    .filter((slot) => slot.day === today && slot.facultyName === currentUser.name)
    .sort((a, b) => compareTimetableTimes(a.startTime, b.startTime))
  const courses = mockAssignments.filter(
    (assignment) =>
      taughtCodes.includes(assignment.subjectCode) && assignment.status === 'Published'
  )
  const courseIds = new Set(courses.map((course) => course.id))
  const needsReview = mockSubmissions.filter(
    (submission) =>
      courseIds.has(submission.assignmentId) &&
      (submission.status === 'Submitted' || submission.status === 'Late')
  )

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="grid gap-4 rounded-2xl border border-[#dce7f7] bg-[#edf3fc] p-5 sm:p-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1b4d9b]">
            Faculty desk · {today}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#152a55]">
            Your teaching day
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
            A practical view of today&apos;s classes, attendance, and coursework that needs your attention.
          </p>
          <WorkspacePreview />
        </div>
        <div className="grid grid-cols-2 gap-3 self-end">
          <DashboardMetric
            icon={CalendarDays}
            label="Classes today"
            value={todayClasses.length}
            detail={today}
            tone="navy"
          />
          <DashboardMetric
            icon={ClipboardCheck}
            label="To review"
            value={needsReview.length}
            detail="Submitted work awaiting review"
            tone={needsReview.length ? 'amber' : 'teal'}
          />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <DashboardPanel
          eyebrow="Teaching schedule"
          title="Today&apos;s classes"
          description="Scheduled classes assigned to your faculty profile."
          action={
            <button
              onClick={() => setActiveTab('My timetable')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              Weekly timetable
            </button>
          }
        >
          {todayClasses.length ? (
            <ol className="space-y-3">
              {todayClasses.map((slot) => (
                <li
                  key={slot.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-[#fbfcfe] p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex shrink-0 items-center gap-2 sm:w-28 sm:flex-col sm:items-start sm:gap-0">
                    <span className="text-xs font-bold text-[#152a55]">{slot.startTime}</span>
                    <span className="text-[11px] text-slate-500">to {slot.endTime}</span>
                  </div>
                  <div className="min-w-0 flex-1 border-l-2 border-[#3571c9] pl-3">
                    <p className="text-sm font-semibold text-slate-800">{slot.subjectName}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span>{slot.subjectCode}</span>
                      <span>{slot.section}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" /> {slot.room}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('Mark attendance')}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1b4d9b] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#153e7e]"
                  >
                    <ClipboardCheck className="size-3.5" />
                    Attendance
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <DashboardEmptyState
              title="No classes assigned today"
              description="Your weekly timetable remains available for planning upcoming teaching sessions."
            />
          )}
        </DashboardPanel>

        <div className="space-y-5">
          <DashboardPanel
            eyebrow="Coursework"
            title="Assignment activity"
            description="Published assignments linked to your assigned subject list."
            action={
              <button
                onClick={() => setActiveTab('Assignments')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                Manage
              </button>
            }
          >
            {courses.length ? (
              <div className="space-y-3">
                {courses.map((course) => {
                  const pending = mockSubmissions.filter(
                    (submission) =>
                      submission.assignmentId === course.id &&
                      (submission.status === 'Submitted' || submission.status === 'Late')
                  ).length
                  return (
                    <article
                      key={course.id}
                      className="rounded-xl border border-slate-200 p-3.5"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#3571c9]">
                        {course.subjectCode} · {course.totalMarks} marks
                      </p>
                      <h3 className="mt-1 text-xs font-semibold leading-relaxed text-slate-800">
                        {course.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
                        <span>{course.submissionsCount} / {course.totalStudents} submissions</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="size-3" /> Due {formatDashboardDate(course.dueDate)}
                        </span>
                      </div>
                      {pending > 0 && (
                        <p className="mt-2 text-[10px] font-semibold text-amber-800">
                          {pending} submission{pending === 1 ? '' : 's'} awaiting review
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : (
              <DashboardEmptyState
                title="No linked assignments"
                description="Published coursework for assigned subjects will appear here."
              />
            )}
          </DashboardPanel>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <DashboardAction
              icon={Users}
              title="Student roster"
              description="Open class and student records"
              onClick={() => setActiveTab('My classes')}
            />
            <DashboardAction
              icon={BookOpen}
              title="Assignments & marks"
              description="Review submissions and marks"
              onClick={() => setActiveTab('Assignments')}
            />
            <DashboardAction
              icon={ArrowRight}
              title="Attendance history"
              description="Review attendance registers"
              onClick={() => setActiveTab('Attendance history')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
