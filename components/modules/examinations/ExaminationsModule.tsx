'use client'

import React, { useState } from 'react'
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MapPin,
  Printer,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { mockExaminations, mockStudentResult } from '@/lib/mock-data'

export function ExaminationsModule() {
  const { role } = useAuth()
  const [tab, setTab] = useState<'schedule' | 'results'>('schedule')
  const [activeSession, setActiveSession] = useState('2026–2027')

  const currentExam = mockExaminations[0]

  return (
    <div className="space-y-6">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {tab === 'schedule' ? 'Examination Schedules & Hall Tickets' : 'Published Grade Reports & Transcripts'}
          </h2>
          <p className="text-xs text-slate-500">
            Office of the Controller of Examinations · Session {activeSession}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTab('schedule')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              tab === 'schedule'
                ? 'bg-[#1b4d9b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Exam Schedule
          </button>
          <button
            onClick={() => setTab('results')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              tab === 'results'
                ? 'bg-[#1b4d9b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Grade Reports & Transcripts
          </button>
        </div>
      </div>

      {tab === 'schedule' ? (
        /* Examination Timetable */
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                  {currentExam.status}
                </span>
                <h3 className="mt-1.5 text-sm font-bold text-slate-900">{currentExam.title}</h3>
                <p className="text-xs text-slate-600">
                  {currentExam.semester} · Runs {currentExam.startDate} through {currentExam.endDate}
                </p>
              </div>

              <button className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]">
                <Download className="size-3.5" /> Download Hall Ticket
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Datesheet & Seating Plan
            </h3>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Exam Timing</th>
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-right">Examination Hall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentExam.schedule.map((slot, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-800">{slot.date}</td>
                      <td className="py-3 px-3 text-slate-600">{slot.time}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#1b4d9b]">
                        {slot.subjectCode}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{slot.subjectName}</td>
                      <td className="py-3 px-3 text-right font-medium text-slate-700">{slot.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Results / Transcript Card */
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Official Result Published
              </span>
              <h3 className="mt-1 text-base font-bold text-slate-900">
                {mockStudentResult.studentName} — Semester Grade Card
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Roll No: {mockStudentResult.rollNumber} · {mockStudentResult.semester}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Printer className="size-3.5" /> Print Transcript
              </button>
            </div>
          </div>

          {/* SGPA & CGPA Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Semester Grade Point Average (SGPA)
              </span>
              <p className="mt-1 text-3xl font-extrabold text-[#152a55]">
                {mockStudentResult.sgpa}
              </p>
              <span className="text-[11px] text-emerald-700 font-bold">First Class with Distinction</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#fbfcfd] p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Cumulative CGPA
              </span>
              <p className="mt-1 text-3xl font-extrabold text-[#152a55]">
                {mockStudentResult.cgpa}
              </p>
              <span className="text-[11px] text-slate-500 font-medium">Rank: Top 5% in CSE Branch</span>
            </div>
          </div>

          {/* Detailed Subject Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-2.5 px-3">Course Code</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3">Credits</th>
                  <th className="py-2.5 px-3">Internal</th>
                  <th className="py-2.5 px-3">External</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3 text-right">Letter Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockStudentResult.subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-[#1b4d9b]">{sub.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{sub.name}</td>
                    <td className="py-3 px-3 text-slate-600">{sub.credits}</td>
                    <td className="py-3 px-3 text-slate-600">{sub.internalMarks}</td>
                    <td className="py-3 px-3 text-slate-600">{sub.externalMarks}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{sub.totalMarks}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 border border-emerald-200/60">
                        {sub.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
