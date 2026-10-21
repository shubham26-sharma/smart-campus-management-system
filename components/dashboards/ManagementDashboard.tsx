'use client'

import React from 'react'
import {
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { mockDepartments, mockNotices } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'

export function ManagementDashboard() {
  const { setActiveTab } = useAuth()

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Enrolled Students"
          value="1,284"
          change="+8.4% YoY"
          trend="up"
          icon={Users}
          subtitle="Across 5 engineering branches"
        />
        <StatCard
          label="Appointed Faculty"
          value="86"
          change="+3.2%"
          trend="up"
          icon={GraduationCap}
          subtitle="92% Ph.D / M.Tech qualified"
        />
        <StatCard
          label="Academic Departments"
          value="12"
          change="Stable"
          trend="neutral"
          icon={Building2}
          subtitle="NBA / NAAC Accredited"
        />
        <StatCard
          label="Average Attendance"
          value="87.6%"
          change="+2.1% MoM"
          trend="up"
          icon={ClipboardCheck}
          subtitle="Institution-wide average"
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Department Overview */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Academic Department Performance</h2>
              <p className="text-xs text-slate-500">Student intake, faculty strength, and attendance rates</p>
            </div>
            <button
              onClick={() => setActiveTab('Departments')}
              className="flex items-center gap-1 text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              View all <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">HOD</th>
                  <th className="py-2.5 px-3">Faculty</th>
                  <th className="py-2.5 px-3">Students</th>
                  <th className="py-2.5 px-3 text-right">Avg Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800">{dept.name}</span>
                      <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                        {dept.code}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{dept.hodName}</td>
                    <td className="py-3 px-3 text-slate-600">{dept.facultyCount}</td>
                    <td className="py-3 px-3 text-slate-600">{dept.studentCount}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        89.4%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial & Complaint Overview */}
        <div className="space-y-6">
          {/* Fee collection summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Fee Realization Summary</h2>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                92% Collected
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Collected</span>
                  <span>₹42,80,000 / ₹46,50,000</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#1b4d9b]" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <span>Outstanding Dues</span>
                <span className="font-bold text-amber-700">₹3,70,000</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('Fee records')}
              className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Audit Fee Ledger
            </button>
          </div>

          {/* Grievance & Helpdesk Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Campus Helpdesk Status</h2>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                18 Open
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="block text-lg font-bold text-slate-800">12</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase">Under Review</span>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3">
                <span className="block text-lg font-bold text-emerald-700">64</span>
                <span className="text-[10px] font-medium text-emerald-600 uppercase">Resolved</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('Complaints')}
              className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Review Complaints Queue
            </button>
          </div>
        </div>
      </div>

      {/* Institution Notices & Strategic Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Executive Circulars & Notices</h2>
            <button
              onClick={() => setActiveTab('Notices')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              Manage Notices
            </button>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {mockNotices.slice(0, 3).map((notice) => (
              <div key={notice.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[#1b4d9b] uppercase">
                    {notice.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{notice.publishedDate}</span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-slate-800 hover:text-[#1b4d9b] cursor-pointer">
                  {notice.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{notice.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Executive Governance Actions
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setActiveTab('Reports')}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-blue-400 hover:bg-blue-50/30 transition-all"
            >
              <FileText className="size-5 text-[#1b4d9b] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">NIRF & NAAC Reports</h4>
                <p className="mt-0.5 text-[11px] text-slate-500">Generate accreditation metrics</p>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('Reports')}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-blue-400 hover:bg-blue-50/30 transition-all"
            >
              <Download className="size-5 text-[#1b4d9b] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Attendance Digest</h4>
                <p className="mt-0.5 text-[11px] text-slate-500">Export monthly percentage sheets</p>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('Departments')}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-blue-400 hover:bg-blue-50/30 transition-all"
            >
              <Building2 className="size-5 text-[#1b4d9b] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Department Audits</h4>
                <p className="mt-0.5 text-[11px] text-slate-500">Review syllabi and labs</p>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('Notices')}
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-blue-400 hover:bg-blue-50/30 transition-all"
            >
              <Bell className="size-5 text-[#1b4d9b] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Issue Institution Notice</h4>
                <p className="mt-0.5 text-[11px] text-slate-500">Broadcast circular to all branches</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
