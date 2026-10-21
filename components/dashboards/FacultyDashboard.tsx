'use client'

import React from 'react'
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { mockAssignments, mockTimetable } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'

export function FacultyDashboard() {
  const { setActiveTab } = useAuth()

  const todayClasses = mockTimetable.filter((t) => t.day === 'Monday')

  return (
    <div className="space-y-6">
      {/* Attendance Quick CTA Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/60 p-5 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1b4d9b] text-white">
            <ClipboardCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Attendance Marking Queue · CS501 Algorithms
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              B.Tech CSE - Semester 5 (Section A) · Room 304 · 10:00 AM Lecture
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('Mark attendance')}
          className="shrink-0 rounded-lg bg-[#1b4d9b] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#153e7e] transition-colors"
        >
          Mark Today&apos;s Attendance
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Assigned Lectures"
          value="4 Classes"
          change="Next at 10:00 AM"
          trend="up"
          icon={CalendarDays}
          subtitle="2 Theory + 1 Lab Session"
        />
        <StatCard
          label="Assigned Students"
          value="126"
          change="3 Sections"
          trend="neutral"
          icon={Users}
          subtitle="CSE 5A, CSE 5B, CSE 3A"
        />
        <StatCard
          label="Submissions to Evaluate"
          value="23 Pending"
          change="Due this week"
          trend="down"
          icon={CheckCircle2}
          subtitle="Dynamic Programming HW"
        />
        <StatCard
          label="Attendance Compliance"
          value="94%"
          change="This Month"
          trend="up"
          icon={ClipboardCheck}
          subtitle="Marked within lecture hour"
        />
      </div>

      {/* Today's Schedule & Pending Submissions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Teaching Schedule */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today&apos;s Teaching Timetable</h3>
              <p className="text-xs text-slate-500">Monday Schedule · CS Department</p>
            </div>
            <button
              onClick={() => setActiveTab('My timetable')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              Full Week
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todayClasses.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 hover:border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#1b4d9b] font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.subjectName}</h4>
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-[#1b4d9b]">
                        {item.subjectCode}
                      </span>
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
                      <span className="font-semibold text-slate-700">{item.section}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setActiveTab('Mark attendance')}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments to Evaluate */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Grading & Evaluation</h3>
              <button
                onClick={() => setActiveTab('Assignments')}
                className="text-xs font-semibold text-[#1b4d9b] hover:underline"
              >
                Review all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {mockAssignments.slice(0, 2).map((asg) => (
                <div key={asg.id} className="rounded-lg border border-slate-100 p-3 bg-slate-50/50">
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[#1b4d9b]">
                    {asg.subjectCode}
                  </span>
                  <h4 className="mt-1 text-xs font-bold text-slate-800 line-clamp-1">{asg.title}</h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {asg.submissionsCount} of {asg.totalStudents} submitted
                    </span>
                    <span className="font-semibold text-amber-700">Due {asg.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('Assignments')}
              className="mt-4 w-full rounded-lg bg-[#1b4d9b] py-2 text-xs font-semibold text-white hover:bg-[#153e7e]"
            >
              Grade Pending Submissions
            </button>
          </div>

          {/* Invigilation Schedule Note */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="size-4 text-[#1b4d9b]" />
              <span>Exam Invigilation Roster</span>
            </div>
            <p className="mt-1 text-slate-500 text-[11px] leading-relaxed">
              Assigned to Mid-Term Exam Hall 101 on Nov 16 (10:00 AM – 12:00 PM).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
