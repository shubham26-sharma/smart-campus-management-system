'use client'

import React from 'react'
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileText,
  GraduationCap,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import {
  mockAssignments,
  mockCampusEvents,
  mockStudentAttendanceBreakdown,
  mockTimetable,
} from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'

export function StudentDashboard() {
  const { setActiveTab } = useAuth()

  const todayClasses = mockTimetable.filter((t) => t.day === 'Monday')

  return (
    <div className="space-y-6">
      {/* Personalized Greeting Header Banner */}
      <div className="rounded-xl border border-blue-200/90 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1b4d9b] text-white font-bold text-sm">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Welcome back, Aarav Mehta!
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  24CSE118
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                B.Tech Computer Science & Engineering · Semester 5 · Section A · Academic Session 2026–2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('My attendance')}
              className="rounded-lg bg-[#1b4d9b] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e] transition-colors"
            >
              My Attendance (91.4%)
            </button>
            <button
              onClick={() => setActiveTab('Results')}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Grade Card
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Semester"
          value="Semester 5"
          change="B.Tech CSE"
          trend="neutral"
          icon={GraduationCap}
          subtitle="Section A · Batch 2024–2028"
        />
        <StatCard
          label="Monthly Attendance"
          value="91.4%"
          change="Safe (> 75%)"
          trend="up"
          icon={ClipboardCheck}
          subtitle="October 2026 record"
        />
        <StatCard
          label="Pending Assignments"
          value="3 Tasks"
          change="Next due Friday"
          trend="down"
          icon={BookOpen}
          subtitle="Algorithms & OS challenges"
        />
        <StatCard
          label="Tuition & Lab Fees"
          value="₹0 Balance"
          change="Fully Paid"
          trend="up"
          icon={WalletCards}
          subtitle="Receipt: REC-2026-秋-1184"
        />
      </div>

      {/* Schedule & Attendance Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Lectures */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s Lectures & Labs</h3>
              <p className="text-xs text-slate-500">Monday Schedule · Room 304, Aryabhatta Block</p>
            </div>
            <button
              onClick={() => setActiveTab('My timetable')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              Full Timetable
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todayClasses.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4 hover:border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-[#1b4d9b]">
                      {item.subjectCode}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{item.subjectName}</h4>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-slate-400" />
                      {item.startTime} – {item.endTime}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-slate-400" />
                      {item.room}
                    </span>
                    <span>·</span>
                    <span className="text-slate-600 font-medium">{item.facultyName}</span>
                  </div>
                </div>

                <span className="self-start sm:self-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Subject Attendance Card */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Attendance by Subject</h3>
              <button
                onClick={() => setActiveTab('My attendance')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                Full Details
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {mockStudentAttendanceBreakdown.slice(0, 4).map((sub) => (
                <div key={sub.subjectCode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span className="truncate pr-2">{sub.subjectCode}</span>
                    <span className="font-bold text-slate-900">
                      {sub.percentage ? `${sub.percentage.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (sub.percentage ?? 0) >= 75 ? 'bg-[#1b4d9b]' : 'bg-rose-500'
                      }`}
                      style={{ width: `${sub.percentage ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('My attendance')}
              className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Monthly Breakdown
            </button>
          </div>

          {/* Upcoming Event Chip */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Sparkles className="size-4 text-[#1b4d9b]" />
              <span>Campus Tech Fest</span>
            </div>
            <p className="mt-1 text-slate-500 text-[11px] leading-relaxed">
              HackCampus 2026 starts Nov 06. Team registration is currently open.
            </p>
            <button
              onClick={() => setActiveTab('Campus events')}
              className="mt-2 text-xs font-bold text-[#1b4d9b] hover:underline inline-flex items-center gap-1"
            >
              Explore Events <ArrowUpRight className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
