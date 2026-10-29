'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, MapPin, Printer } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api-client'
import { DataSourceIndicator } from '@/components/ui/data-source-indicator'
import { mockDepartments, mockFaculty, mockStudents, mockSubjects } from '@/lib/mock-data'
import { compareTimetableTimes } from '@/lib/timetable-utils'
import { TimetableSlot } from '@/types'

const DAYS: TimetableSlot['day'][] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function TimetableModule() {
  const { currentUser, role } = useAuth()
  const [selectedDay, setSelectedDay] = useState<TimetableSlot['day']>('Monday')
  const [timetable, setTimetable] = useState<TimetableSlot[]>([])
  const [isMock, setIsMock] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    apiClient.getTimetable()
      .then((response) => {
        if (!active) return
        setTimetable(response.data)
        setIsMock(response.isMock === true)
      })
      .catch(() => {
        if (active) setError('Timetable data could not be loaded.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const authorizedSlots = useMemo(() => {
    if (role === 'Student') {
      const student = mockStudents.find((item) => item.rollNumber === currentUser.rollNumber)
      const department = mockDepartments.find((item) => item.name === student?.department)
      if (!student || !department) return []
      const semesterNumber = student.semester.replace(/^Semester\s+/i, '')
      const classSection = `${department.code}-${semesterNumber}${student.section}`
      return timetable.filter((slot) => slot.section === classSection)
    }

    if (role === 'Faculty') {
      const facultyName = mockFaculty.find((item) => item.name === currentUser.name)?.name
      return facultyName ? timetable.filter((slot) => slot.facultyName === facultyName) : []
    }

    if (role === 'HOD') {
      const subjectCodes = new Set(
        mockSubjects
          .filter((subject) => subject.department === currentUser.department)
          .map((subject) => subject.code)
      )
      return timetable.filter((slot) => subjectCodes.has(slot.subjectCode))
    }

    return timetable
  }, [currentUser.department, currentUser.name, currentUser.rollNumber, role, timetable])

  const daySlots = authorizedSlots
    .filter((slot) => slot.day === selectedDay)
    .sort((a, b) => compareTimetableTimes(a.startTime, b.startTime))

  const title =
    role === 'Student'
      ? 'My class timetable'
      : role === 'Faculty'
        ? 'My teaching timetable'
        : role === 'HOD'
          ? 'Department timetable'
          : 'Institution timetable'
  const scope =
    role === 'Student'
      ? 'Your assigned class schedule'
      : role === 'Faculty'
        ? 'Teaching sessions assigned to your faculty profile'
        : role === 'HOD'
          ? `Classes and faculty in ${currentUser.department}`
          : 'Institution-wide schedule'

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{scope}</p>
          {isMock && <DataSourceIndicator className="mt-2" />}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Printer className="size-3.5" /> Print timetable
        </button>
      </header>

      {role === 'Admin' && (
        <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-900" role="note">
          Timetable creation, section assignment, and teacher allocation need backend mutation endpoints; this page is read-only.
        </p>
      )}

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold ${
              selectedDay === day
                ? 'bg-[#1b4d9b] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">{selectedDay} schedule</h3>
          <span className="text-xs text-slate-500">
            {authorizedSlots.length} sessions in this timetable
          </span>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-xs text-slate-500">Loading timetable…</p>
        ) : error ? (
          <p className="py-10 text-center text-xs text-rose-700" role="alert">{error}</p>
        ) : daySlots.length ? (
          <ol className="divide-y divide-slate-100">
            {daySlots.map((slot) => (
              <li key={slot.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center gap-2 text-xs sm:w-32 sm:flex-col sm:items-start sm:gap-1">
                  <span className="font-bold text-[#152a55]">{slot.startTime}</span>
                  <span className="text-slate-500">to {slot.endTime}</span>
                </div>
                <div className="min-w-0 flex-1 border-l-2 border-[#3571c9] pl-3">
                  <p className="text-sm font-semibold text-slate-900">{slot.subjectName}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span>{slot.subjectCode}</span>
                    <span>{slot.section}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" /> {slot.room}
                    </span>
                  </p>
                </div>
                {role !== 'Student' && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                    <CalendarDays className="size-3.5" /> {slot.facultyName}
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="py-10 text-center">
            <CalendarDays className="mx-auto size-5 text-slate-400" />
            <p className="mt-2 text-xs font-semibold text-slate-700">No sessions scheduled</p>
            <p className="mt-1 text-[11px] text-slate-500">
              No {selectedDay.toLowerCase()} sessions are available for this timetable.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
