'use client'

import { useEffect, useState } from 'react'
import { Printer } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api-client'
import { DataSourceIndicator } from '@/components/ui/data-source-indicator'
import { mockStudents } from '@/lib/mock-data'
import { StudentResult } from '@/types'

export function ResultsModule() {
  const { currentUser, role } = useAuth()
  const student = mockStudents.find((item) => item.rollNumber === currentUser.rollNumber)
  const [result, setResult] = useState<StudentResult | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (role !== 'Student' || !student) {
      setIsLoading(false)
      return () => {
        active = false
      }
    }

    apiClient.getStudentResult(student.id)
      .then((response) => {
        if (!active) return
        if (response.data.studentId !== student.id) {
          setError('The result response did not match your student record.')
        } else if (response.data.status === 'Published') {
          setResult(response.data)
          setIsMock(response.isMock === true)
        }
      })
      .catch(() => {
        if (active) setError('Your result could not be loaded.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [role, student])

  if (role !== 'Student') {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900" role="status">
        Published student results are available only in the student workspace.
      </p>
    )
  }

  if (isLoading) return <p className="text-xs text-slate-500">Loading published results…</p>
  if (error) return <p className="text-xs text-rose-700" role="alert">{error}</p>
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
        <p className="text-sm font-semibold text-slate-700">No published results available</p>
        <p className="mt-1 text-xs text-slate-500">Draft results are not shown to students.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Published results</h2>
            {isMock && <DataSourceIndicator />}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {result.studentName} · {result.rollNumber} · {result.semester} · {result.academicSession}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Printer className="size-3.5" /> Print result
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Semester GPA</p>
          <p className="mt-1 text-3xl font-extrabold text-[#152a55]">{result.sgpa.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Cumulative GPA</p>
          <p className="mt-1 text-3xl font-extrabold text-[#152a55]">{result.cgpa.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[680px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Internal</th>
              <th className="px-4 py-3">External</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result.subjects.map((subject) => (
              <tr key={subject.code}>
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-[#1b4d9b]">{subject.code}</span>
                  <span className="ml-2 font-medium text-slate-800">{subject.name}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{subject.credits}</td>
                <td className="px-4 py-3 text-slate-600">{subject.internalMarks}</td>
                <td className="px-4 py-3 text-slate-600">{subject.externalMarks}</td>
                <td className="px-4 py-3 font-bold text-slate-800">{subject.totalMarks}</td>
                <td className="px-4 py-3 font-bold text-emerald-700">{subject.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500">Published {result.publishedDate}</p>
    </div>
  )
}
