'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Printer } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api-client'
import { DataSourceIndicator } from '@/components/ui/data-source-indicator'
import { mockFaculty, mockSubjects } from '@/lib/mock-data'
import { Examination } from '@/types'

function sortExaminations(examinations: Examination[]) {
  return examinations
    .map((exam) => ({
      ...exam,
      schedule: [...exam.schedule].sort((a, b) => a.date.localeCompare(b.date)),
    }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export function ExaminationsModule() {
  const { currentUser, role } = useAuth()
  const [examinations, setExaminations] = useState<Examination[]>([])
  const [isMock, setIsMock] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    apiClient.getExaminations()
      .then((response) => {
        if (!active) return
        setExaminations(response.data)
        setIsMock(response.isMock === true)
      })
      .catch(() => {
        if (active) setError('Examination schedules could not be loaded.')
      })
    return () => {
      active = false
    }
  }, [])

  const visibleExaminations = useMemo(() => {
    if (role === 'Student') {
      return sortExaminations(examinations.filter((exam) => exam.semester === currentUser.semester))
    }

    if (role === 'Faculty') {
      const faculty = mockFaculty.find((item) => item.name === currentUser.name)
      const subjectCodes = new Set(faculty?.subjects.map((subject) => subject.split(' ')[0]) ?? [])
      return sortExaminations(
        examinations
          .map((exam) => ({
            ...exam,
            schedule: exam.schedule.filter((slot) => subjectCodes.has(slot.subjectCode)),
          }))
          .filter((exam) => exam.schedule.length > 0)
      )
    }

    if (role === 'HOD') {
      const subjectCodes = new Set(
        mockSubjects
          .filter((subject) => subject.department === currentUser.department)
          .map((subject) => subject.code)
      )
      return sortExaminations(
        examinations
          .map((exam) => ({
            ...exam,
            schedule: exam.schedule.filter((slot) => subjectCodes.has(slot.subjectCode)),
          }))
          .filter((exam) => exam.schedule.length > 0)
      )
    }

    return sortExaminations(examinations)
  }, [currentUser.department, currentUser.name, currentUser.semester, examinations, role])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Examination schedules</h2>
          <p className="mt-1 text-xs text-slate-500">
            {role === 'Student'
              ? `Schedules for ${currentUser.semester ?? 'your class'}`
              : role === 'Faculty'
                ? 'Exams for subjects assigned to your faculty profile'
                : role === 'HOD'
                  ? `Exams for ${currentUser.department}`
                  : 'Institution-wide examination schedule'}
          </p>
          {isMock && <DataSourceIndicator className="mt-2" />}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Printer className="size-3.5" /> Print schedules
        </button>
      </header>

      {error && <p className="text-xs text-rose-700" role="alert">{error}</p>}

      {!error && visibleExaminations.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
          <CalendarDays className="mx-auto size-5 text-slate-400" />
          <p className="mt-2 text-sm font-semibold text-slate-700">No examination schedules available</p>
          <p className="mt-1 text-xs text-slate-500">
            Schedules for your authorized subjects or class will appear here when published.
          </p>
        </div>
      )}

      {visibleExaminations.map((exam) => (
        <section key={exam.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-2 border-b border-slate-100 bg-[#f8faff] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                {exam.type} · {exam.status}
              </span>
              <h3 className="mt-2 text-sm font-bold text-slate-900">{exam.title}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {exam.semester} · {exam.academicSession} · {exam.startDate} – {exam.endDate}
              </p>
            </div>
          </div>
          {exam.schedule.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Hall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exam.schedule.map((slot) => (
                    <tr key={`${exam.id}-${slot.date}-${slot.subjectCode}`} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">{slot.date}</td>
                      <td className="px-4 py-3 text-slate-600">{slot.time}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-[#1b4d9b]">{slot.subjectCode}</span>
                        <span className="ml-2 font-medium text-slate-800">{slot.subjectName}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{slot.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-4 text-xs text-slate-500">No subject schedule has been published for this exam.</p>
          )}
        </section>
      ))}
    </div>
  )
}
