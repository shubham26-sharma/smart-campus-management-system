'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  PieChart,
  Printer,
  TrendingUp,
  Users,
} from 'lucide-react'
import { mockDepartments } from '@/lib/mock-data'

export function ReportsModule() {
  const [selectedReport, setSelectedReport] = useState('attendance')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Institutional Analytics & Audit Reports</h2>
          <p className="text-xs text-slate-500">
            Official aggregated records for Academic Council and Governing Body compliance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Printer className="size-3.5" /> Print Summary
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]">
            <Download className="size-3.5" /> Export Excel
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2.5">
        {[
          { id: 'attendance', label: 'Monthly Attendance Analytics', icon: ClipboardCheck },
          { id: 'enrollment', label: 'Student Enrollment & Intake', icon: Users },
          { id: 'performance', label: 'Examination & SGPA Spread', icon: TrendingUp },
          { id: 'financial', label: 'Fee Realization Ledger', icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setSelectedReport(item.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedReport === item.id
                  ? 'bg-[#1b4d9b] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* 1. Monthly Attendance Analytics */}
      {selectedReport === 'attendance' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Branch-Wise Monthly Attendance Benchmark (October 2026)
                </h3>
                <p className="text-xs text-slate-500">Statutory 75% attendance compliance bar</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                Institution Avg: 87.6%
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { name: 'Computer Science & Engineering', pct: 89.2, total: 480 },
                { name: 'Artificial Intelligence & Data Science', pct: 91.4, total: 240 },
                { name: 'Electronics & Communication', pct: 86.8, total: 360 },
                { name: 'Mechanical Engineering', pct: 84.1, total: 210 },
                { name: 'Civil Engineering', pct: 85.5, total: 180 },
              ].map((b) => (
                <div key={b.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-800">
                    <span>{b.name} ({b.total} students)</span>
                    <span className="font-mono text-[#1b4d9b]">{b.pct}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1b4d9b]"
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Enrollment Breakdown */}
      {selectedReport === 'enrollment' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Total Sanctioned Intake vs Admitted Strength (2026–2027)
          </h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Approved AICTE Intake</th>
                  <th className="py-2.5 px-3">Admitted 2026</th>
                  <th className="py-2.5 px-3">Total Department Strength</th>
                  <th className="py-2.5 px-3 text-right">Occupancy Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-800">{dept.name}</td>
                    <td className="py-3 px-3 text-slate-600">120 seats</td>
                    <td className="py-3 px-3 text-slate-600">120</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{dept.studentCount}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">100%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Performance & SGPA */}
      {selectedReport === 'performance' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Semester 4 Result Distribution Curve
          </h3>
          <div className="grid gap-3 sm:grid-cols-4 text-center mt-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                SGPA &gt; 9.0 (O Grade)
              </span>
              <p className="mt-1 text-2xl font-bold text-[#1b4d9b]">18.4%</p>
              <span className="text-[11px] text-slate-500">Distinction</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                SGPA 8.0 – 8.9 (A Grade)
              </span>
              <p className="mt-1 text-2xl font-bold text-[#1b4d9b]">44.2%</p>
              <span className="text-[11px] text-slate-500">First Division</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                SGPA 7.0 – 7.9 (B Grade)
              </span>
              <p className="mt-1 text-2xl font-bold text-slate-700">28.6%</p>
              <span className="text-[11px] text-slate-500">Second Division</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Backlogs / Re-appear
              </span>
              <p className="mt-1 text-2xl font-bold text-rose-600">8.8%</p>
              <span className="text-[11px] text-slate-500">Remedial Classes</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Financial Ledger */}
      {selectedReport === 'financial' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Fee Recovery & Ledger Status
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 text-center">
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-800">
                Total Realized
              </span>
              <p className="mt-1 text-2xl font-bold text-emerald-800">₹42,80,000</p>
              <span className="text-[11px] text-emerald-700">92% of target</span>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-100">
              <span className="text-[10px] uppercase font-bold text-amber-800">
                Pending Installments
              </span>
              <p className="mt-1 text-2xl font-bold text-amber-800">₹3,70,000</p>
              <span className="text-[11px] text-amber-700">Due Nov 15</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Total Budget
              </span>
              <p className="mt-1 text-2xl font-bold text-slate-800">₹46,50,000</p>
              <span className="text-[11px] text-slate-400">Autumn Term 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
