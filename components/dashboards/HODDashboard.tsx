'use client'

import React from 'react'
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { mockAssignments, mockClasses, mockFaculty, mockSubjects } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'

export function HODDashboard() {
  const { setActiveTab } = useAuth()

  return (
    <div className="space-y-6">
      {/* Scope banner */}
      <div className="rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b4d9b]">
              Authorized Departmental Scope
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Department of Computer Science & Engineering (B.Tech CSE)
            </h2>
            <p className="text-xs text-slate-500">
              Academic Session 2026–2027 · HOD: Dr. Sunita Kulkarni
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200 shadow-2xs">
              4 Active Batches
            </span>
            <button
              onClick={() => setActiveTab('Faculty')}
              className="rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#153e7e]"
            >
              Faculty Workload
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Department Students"
          value="342"
          change="+12 this month"
          trend="up"
          icon={Users}
          subtitle="Semesters 3, 5, and 7"
        />
        <StatCard
          label="Department Faculty"
          value="18"
          change="2 on leave"
          trend="neutral"
          icon={GraduationCap}
          subtitle="Avg workload: 14 hrs/week"
        />
        <StatCard
          label="Active Class Sections"
          value="14"
          change="4 today"
          trend="up"
          icon={BookOpen}
          subtitle="All rooms allocated"
        />
        <StatCard
          label="CSE Monthly Attendance"
          value="89.2%"
          change="+1.8%"
          trend="up"
          icon={ClipboardCheck}
          subtitle="Above institutional threshold"
        />
      </div>

      {/* Faculty Allocations & Teaching Schedule */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Faculty-Subject Allocations */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                CSE Faculty-Subject Allocations (Sem 5)
              </h3>
              <p className="text-xs text-slate-500">Curriculum coverage and assigned professors</p>
            </div>
            <button
              onClick={() => setActiveTab('Subjects')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              View Curriculum
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Subject Code & Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Credits</th>
                  <th className="py-2.5 px-3">Assigned Faculty</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockSubjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800">{sub.name}</span>
                      <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                        {sub.code}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{sub.type}</td>
                    <td className="py-3 px-3 text-slate-600">{sub.credits}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{sub.facultyName}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        On Track
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Quick Actions & Complaints */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Department Governance
            </h3>
            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => setActiveTab('Attendance analytics')}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <ClipboardCheck className="size-4 text-[#1b4d9b]" />
                  <span className="text-xs font-semibold text-slate-800">
                    Department Attendance Analytics
                  </span>
                </div>
                <ArrowUpRight className="size-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setActiveTab('Timetable')}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="size-4 text-[#1b4d9b]" />
                  <span className="text-xs font-semibold text-slate-800">
                    Verify Master Timetable
                  </span>
                </div>
                <ArrowUpRight className="size-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setActiveTab('Reports')}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-[#1b4d9b]" />
                  <span className="text-xs font-semibold text-slate-800">
                    Syllabus Progression Report
                  </span>
                </div>
                <ArrowUpRight className="size-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Departmental Alert */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldCheck className="size-4 text-amber-700" />
              <span>Mid-Term Attendance Defaulters Warning</span>
            </div>
            <p className="mt-1.5 text-amber-800/90 leading-relaxed text-[11px]">
              2 students in CSE Section A currently have attendance below 75%. Notices have been sent to their mentors.
            </p>
            <button
              onClick={() => setActiveTab('Attendance analytics')}
              className="mt-3 text-xs font-bold text-amber-900 underline"
            >
              Review Defaulter List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
