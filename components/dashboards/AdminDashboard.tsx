'use client'

import React from 'react'
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  GraduationCap,
  MessageSquare,
  Plus,
  Settings,
  ShieldAlert,
  Sparkles,
  Users,
  WalletCards,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { mockComplaints, mockStudents } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth-context'

export function AdminDashboard() {
  const { setActiveTab } = useAuth()

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Student Accounts"
          value="1,284"
          change="24 pending approval"
          trend="neutral"
          icon={Users}
          subtitle="Session 2026–2027"
        />
        <StatCard
          label="Faculty Accounts"
          value="86"
          change="3 pending KYC"
          trend="neutral"
          icon={GraduationCap}
          subtitle="All staff active"
        />
        <StatCard
          label="Open Complaints"
          value="18"
          change="6 marked urgent"
          trend="down"
          icon={MessageSquare}
          subtitle="Campus helpdesk queue"
        />
        <StatCard
          label="Fee Collection"
          value="₹42.8L"
          change="92% realized"
          trend="up"
          icon={WalletCards}
          subtitle="Autumn term collections"
        />
      </div>

      {/* Quick Administrative Shortcuts */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Core ERP Administration Modules
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => setActiveTab('Students')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-blue-400 hover:bg-blue-50/20 transition-all"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#1b4d9b]">
              <Users className="size-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Student Directory</h4>
              <p className="text-[11px] text-slate-400">Admissions & verification</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('Faculty')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-blue-400 hover:bg-blue-50/20 transition-all"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#1b4d9b]">
              <GraduationCap className="size-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Faculty Records</h4>
              <p className="text-[11px] text-slate-400">Staff roles & allotments</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('Fee records')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-blue-400 hover:bg-blue-50/20 transition-all"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#1b4d9b]">
              <WalletCards className="size-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fee Accounts</h4>
              <p className="text-[11px] text-slate-400">Receipts & dues collection</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('Notices')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-blue-400 hover:bg-blue-50/20 transition-all"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#1b4d9b]">
              <Bell className="size-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Notice Broadcast</h4>
              <p className="text-[11px] text-slate-400">Circulars & notifications</p>
            </div>
          </button>
        </div>
      </div>

      {/* Complaints Pipeline & System Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Urgent Complaints */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Urgent Grievance Tickets</h3>
              <p className="text-xs text-slate-500">Requires administrative technician dispatch</p>
            </div>
            <button
              onClick={() => setActiveTab('Complaints')}
              className="text-xs font-semibold text-[#1b4d9b] hover:underline"
            >
              All Complaints
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100">
            {mockComplaints.slice(0, 3).map((cmp) => (
              <div key={cmp.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">{cmp.ticketId}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      cmp.priority === 'Urgent'
                        ? 'bg-rose-50 text-rose-700'
                        : cmp.priority === 'High'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-blue-50 text-[#1b4d9b]'
                    }`}
                  >
                    {cmp.priority} Priority
                  </span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-slate-800">{cmp.subject}</h4>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Category: {cmp.category}</span>
                  <span>·</span>
                  <span>Status: {cmp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Session & System Settings */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Current Academic Session Configuration
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-xs">
              <div>
                <span className="block font-bold text-slate-800">Active Term: Autumn 2026–2027</span>
                <span className="text-slate-400 text-[11px]">Started: August 01, 2026 · Ends: Dec 15, 2026</span>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-xs">
              <div>
                <span className="block font-bold text-slate-800">Attendance Lock Window</span>
                <span className="text-slate-400 text-[11px]">Daily auto-lock at 11:59 PM</span>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#1b4d9b]">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-xs">
              <div>
                <span className="block font-bold text-slate-800">PostgreSQL Backend Connection</span>
                <span className="text-slate-400 text-[11px]">FastAPI Gateway at localhost:8000</span>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                Mock Mode Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
