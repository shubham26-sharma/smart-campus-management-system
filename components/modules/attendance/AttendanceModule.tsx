'use client'

import React, { useMemo, useState } from 'react'
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Search,
  Users,
  X,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import {
  mockClasses,
  mockRecentAttendanceRecords,
  mockStudentAttendanceBreakdown,
  mockStudents,
  mockSubjects,
} from '@/lib/mock-data'
import { AttendanceRecord, Role } from '@/types'

export function AttendanceModule() {
  const { role } = useAuth()

  // For Student role: show personal attendance records
  if (role === 'Student') {
    return <StudentAttendanceView />
  }

  // For HOD / Management: show departmental & institution attendance analytics with class drills
  if (role === 'Management' || role === 'HOD') {
    return <LeadershipAttendanceView role={role} />
  }

  // For Faculty & Admin: show Faculty Attendance Marking Interface & History
  return <FacultyAttendanceMarkingView />
}

// -------------------------------------------------------------
// 1. FACULTY ATTENDANCE MARKING INTERFACE
// -------------------------------------------------------------
function FacultyAttendanceMarkingView() {
  const [selectedClass, setSelectedClass] = useState('cls-cse-5a')
  const [selectedSubject, setSelectedSubject] = useState('sub-cs501')
  const [selectedDate, setSelectedDate] = useState('2026-10-20')
  const [selectedSession, setSelectedSession] = useState('Lecture 02 (10:00 AM – 11:00 AM)')
  const [searchQuery, setSearchQuery] = useState('')

  // Student Attendance State: Map studentId -> boolean (true: Present, false: Absent)
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(mockStudents.map((s) => [s.id, true]))
  )
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSavedSuccess, setIsSavedSuccess] = useState(false)
  const [savedRecords, setSavedRecords] = useState<AttendanceRecord[]>(mockRecentAttendanceRecords)
  const [viewMode, setViewMode] = useState<'mark' | 'history'>('mark')

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return mockStudents
    const q = searchQuery.toLowerCase()
    return mockStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const presentCount = useMemo(
    () => Object.values(attendance).filter(Boolean).length,
    [attendance]
  )
  const absentCount = mockStudents.length - presentCount

  const handleToggle = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
    setHasUnsavedChanges(true)
    setIsSavedSuccess(false)
  }

  const handleMarkAll = (status: boolean) => {
    const updated = Object.fromEntries(mockStudents.map((s) => [s.id, status]))
    setAttendance(updated)
    setHasUnsavedChanges(true)
    setIsSavedSuccess(false)
  }

  const handleSaveConfirmed = () => {
    const newRecord: AttendanceRecord = {
      id: `att-rec-${Date.now()}`,
      date: selectedDate,
      lectureSession: selectedSession,
      classId: selectedClass,
      className: mockClasses.find((c) => c.id === selectedClass)?.name || 'B.Tech CSE - 5th Sem (Sec A)',
      subjectId: selectedSubject,
      subjectName: mockSubjects.find((s) => s.id === selectedSubject)?.name || 'Design & Analysis of Algorithms',
      totalStudents: mockStudents.length,
      presentCount,
      absentCount,
      markedBy: 'Prof. Arjun Kumar',
      markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setSavedRecords((prev) => [newRecord, ...prev])
    setHasUnsavedChanges(false)
    setIsConfirmOpen(false)
    setIsSavedSuccess(true)
  }

  return (
    <div className="space-y-6">
      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('mark')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              viewMode === 'mark'
                ? 'bg-[#1b4d9b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mark Daily Attendance
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              viewMode === 'history'
                ? 'bg-[#1b4d9b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Saved Records Log ({savedRecords.length})
          </button>
        </div>

        {hasUnsavedChanges && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            Unsaved changes
          </span>
        )}
      </div>

      {isSavedSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4.5 text-emerald-600" />
            <span className="font-semibold">
              Attendance saved successfully for {selectedSession}! Total marked: {mockStudents.length} ({presentCount} Present, {absentCount} Absent).
            </span>
          </div>
          <button
            onClick={() => setIsSavedSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {viewMode === 'mark' ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Lecture Configuration Bar */}
          <div className="border-b border-slate-100 bg-[#fbfcfd] p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Assigned Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#1b4d9b]"
                >
                  {mockClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Subject / Course
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#1b4d9b]"
                >
                  {mockSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}: {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Lecture Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#1b4d9b]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Lecture Session
                </label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#1b4d9b]"
                >
                  <option>Lecture 01 (09:00 AM – 10:00 AM)</option>
                  <option>Lecture 02 (10:00 AM – 11:00 AM)</option>
                  <option>Lecture 03 (11:15 AM – 12:15 PM)</option>
                  <option>Lecture 04 (01:30 PM – 02:30 PM)</option>
                  <option>Practical Lab (02:30 PM – 04:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Quick Bulk Action & Summary Row */}
            <div className="mt-5 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter student name or roll..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none w-52 sm:w-64"
                  />
                </div>
                <button
                  onClick={() => handleMarkAll(true)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  All Present
                </button>
                <button
                  onClick={() => handleMarkAll(false)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                >
                  All Absent
                </button>
                <button
                  onClick={() => {
                    setAttendance(Object.fromEntries(mockStudents.map((s) => [s.id, true])))
                    setHasUnsavedChanges(false)
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                  title="Reset to default"
                >
                  <RefreshCw className="size-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {presentCount} Present
                  </span>
                  <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                    {absentCount} Absent
                  </span>
                </div>
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="rounded-lg bg-[#1b4d9b] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e] transition-colors"
                >
                  Save Attendance Record
                </button>
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-5">#</th>
                  <th className="py-3 px-5">Student Name</th>
                  <th className="py-3 px-5">Roll Number</th>
                  <th className="py-3 px-5">Semester / Branch</th>
                  <th className="py-3 px-5">Overall Record</th>
                  <th className="py-3 px-5 text-right">Attendance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.map((student, idx) => {
                  const isPresent = attendance[student.id] ?? true
                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !isPresent ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-slate-900">{student.name}</span>
                        <span className="block text-[11px] text-slate-400">{student.email}</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600 font-semibold">
                        {student.rollNumber}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {student.semester} · Sec {student.section}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            student.attendancePercentage >= 75
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {student.attendancePercentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleToggle(student.id)}
                          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shadow-2xs ${
                            isPresent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {isPresent ? '✓ Present' : '✗ Absent'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Saved Records History */
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Historical Attendance Logs</h3>
              <p className="text-xs text-slate-500">Archived register entries for B.Tech CSE</p>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <Download className="size-3.5" /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Session</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Present</th>
                  <th className="py-2.5 px-3">Absent</th>
                  <th className="py-2.5 px-3">Marked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-800">{rec.date}</td>
                    <td className="py-3 px-3 text-slate-600">{rec.lectureSession}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{rec.subjectName}</td>
                    <td className="py-3 px-3 text-slate-500">{rec.className}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-700">{rec.presentCount}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-rose-700">{rec.absentCount}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{rec.markedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Attendance Submission"
        description="Verify lecture details and student presence before locking the register."
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Session:</span>
              <span className="font-bold text-slate-800">
                {selectedDate} · {selectedSession}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subject:</span>
              <span className="font-bold text-slate-800">
                {mockSubjects.find((s) => s.id === selectedSubject)?.name}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">Present Count:</span>
              <span className="font-bold text-emerald-700">{presentCount} Students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Absent Count:</span>
              <span className="font-bold text-rose-700">{absentCount} Students</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel & Review
            </button>
            <button
              onClick={handleSaveConfirmed}
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e]"
            >
              Confirm & Save Register
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// -------------------------------------------------------------
// 2. STUDENT ATTENDANCE VIEW (Formula & Monthly Breakdown)
// -------------------------------------------------------------
function StudentAttendanceView() {
  const [selectedMonth, setSelectedMonth] = useState('October 2026')

  // Calculate Overall Monthly Percentage:
  // (Total classes attended in month / Total classes conducted in month) * 100
  const totals = useMemo(() => {
    let conducted = 0
    let attended = 0
    mockStudentAttendanceBreakdown.forEach((sub) => {
      conducted += sub.classesConducted
      attended += sub.classesAttended
    })
    const percentage = conducted > 0 ? (attended / conducted) * 100 : null
    return { conducted, attended, absent: conducted - attended, percentage }
  }, [])

  return (
    <div className="space-y-6">
      {/* Month Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Student Attendance Dashboard</h2>
          <p className="text-xs text-slate-500">
            Aarav Mehta (24CSE118) · B.Tech CSE Semester 5 · Section A
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#1b4d9b]"
          >
            <option>October 2026</option>
            <option>September 2026</option>
            <option>August 2026</option>
          </select>
        </div>
      </div>

      {/* Aggregate KPI Formula Card */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Monthly Formula Percentage
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {totals.percentage ? `${totals.percentage.toFixed(1)}%` : 'N/A'}
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              Above 75% Criteria
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Formula: (Classes Attended ÷ Classes Conducted) × 100
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Classes Conducted
          </span>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {totals.conducted} Lectures
          </p>
          <p className="mt-2 text-[11px] text-slate-500">Excludes cancelled periods</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Classes Attended
          </span>
          <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-700">
            {totals.attended} Lectures
          </p>
          <p className="mt-2 text-[11px] text-slate-500">Present in register</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Classes Absent
          </span>
          <p className="mt-2 text-3xl font-bold tracking-tight text-rose-600">
            {totals.absent} Lectures
          </p>
          <p className="mt-2 text-[11px] text-slate-500">Excused & unexcused</p>
        </div>
      </div>

      {/* Subject-Wise Detailed Cards */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Subject-Wise Attendance Breakdown</h3>
            <p className="text-xs text-slate-500">
              Review percentage in each individual subject for {selectedMonth}
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1b4d9b]">
            6 Registered Courses
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockStudentAttendanceBreakdown.map((item) => {
            const pct = item.percentage
            const isSafe = (pct ?? 0) >= 75
            return (
              <div
                key={item.subjectCode}
                className="rounded-xl border border-slate-200/90 bg-[#fafbfe] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                      {item.subjectCode}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSafe ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {pct ? `${pct.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-1">
                    {item.subjectName}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-500">{item.facultyName}</p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>Attended</span>
                      <span>
                        {item.classesAttended} / {item.classesConducted} classes
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isSafe ? 'bg-[#1b4d9b]' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Absent: {item.classesConducted - item.classesAttended}</span>
                  <span className={isSafe ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                    {isSafe ? 'Eligible for Exams' : 'Low Attendance Alert'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 3. LEADERSHIP ATTENDANCE VIEW (HOD & Management)
// -------------------------------------------------------------
function LeadershipAttendanceView({ role }: { role: Role }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {role === 'HOD' ? 'CSE Department' : 'Institution-Wide'} Attendance Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated monthly compliance and defaulter thresholds
            </p>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="size-3.5" /> Export Senate Summary
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Average Monthly Attendance
            </span>
            <p className="mt-1 text-2xl font-bold text-slate-900">89.2%</p>
            <span className="text-[11px] text-emerald-700 font-semibold">+1.8% vs last month</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Students Below 75% Threshold
            </span>
            <p className="mt-1 text-2xl font-bold text-rose-600">2 Defaulters</p>
            <span className="text-[11px] text-slate-500">Informed via Guardian SMS</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Total Lectures Conducted
            </span>
            <p className="mt-1 text-2xl font-bold text-slate-900">482 Sessions</p>
            <span className="text-[11px] text-slate-500">Across 14 class sections</span>
          </div>
        </div>

        {/* Section Breakdown Table */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Section-Wise Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                  <th className="py-2.5 px-3">Section / Class</th>
                  <th className="py-2.5 px-3">Class Teacher</th>
                  <th className="py-2.5 px-3">Students</th>
                  <th className="py-2.5 px-3">Conducted</th>
                  <th className="py-2.5 px-3 text-right">Average Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-800">{cls.name}</td>
                    <td className="py-3 px-3 text-slate-600">{cls.classTeacher}</td>
                    <td className="py-3 px-3 text-slate-600">{cls.studentCount}</td>
                    <td className="py-3 px-3 text-slate-600">96 hrs</td>
                    <td className="py-3 px-3 text-right">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        89.4%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
