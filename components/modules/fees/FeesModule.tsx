'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  Download,
  FileText,
  Plus,
  Printer,
  Receipt,
  Search,
  WalletCards,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import { mockFeeRecord, mockStudents } from '@/lib/mock-data'
import { FeeRecord } from '@/types'

export function FeesModule() {
  const { role } = useAuth()
  const isAdmin = ['Admin', 'Management'].includes(role)

  const [feeRecord, setFeeRecord] = useState<FeeRecord>(mockFeeRecord)
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [recordForm, setRecordForm] = useState({
    studentRoll: '24CSE121',
    amount: 15000,
    receiptNo: `REC-2026-秋-${Math.floor(1000 + Math.random() * 9000)}`,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {role === 'Student' ? 'My Tuition & Academic Fee Statement' : 'Fee Records & Dues Ledger'}
          </h2>
          <p className="text-xs text-slate-500">
            B.Tech Computer Science and Engineering · Academic Session 2026–2027
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Printer className="size-3.5" /> Print Statement
          </button>
          {isAdmin && (
            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]"
            >
              <Plus className="size-3.5" /> Record Fee Payment
            </button>
          )}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Assessed Fee
          </span>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            ₹{feeRecord.totalFee.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Autumn Semester 2026</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Paid Amount
          </span>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700">
            ₹{feeRecord.paidAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Cleared</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Outstanding Balance
          </span>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            ₹{feeRecord.pendingAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">No Pending Dues</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Clearance Status
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
              ✓ Fully Paid
            </span>
          </div>
          <span className="mt-2 block text-[11px] text-slate-400 font-mono">
            {feeRecord.receiptNumber}
          </span>
        </div>
      </div>

      {/* Itemized Fee Breakdown Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Itemized Semester Tuition Breakdown
        </h3>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-2.5 px-3">Fee Component</th>
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-semibold text-slate-800">
                  Academic Tuition & Laboratory Fee
                </td>
                <td className="py-3 px-3 text-slate-500">Autumn 2026</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                  ₹{feeRecord.tuitionFee.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">Cleared</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-semibold text-slate-800">Computing & Lab Consumables</td>
                <td className="py-3 px-3 text-slate-500">Autumn 2026</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                  ₹{feeRecord.labFee.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">Cleared</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-semibold text-slate-800">Central Library & IEEE Digital Access</td>
                <td className="py-3 px-3 text-slate-500">Annual 2026–27</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                  ₹{feeRecord.libraryFee.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">Cleared</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-semibold text-slate-800">Hostel & Campus Boarding Fee</td>
                <td className="py-3 px-3 text-slate-500">Autumn 2026</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">
                  ₹{(feeRecord.hostelFee || 25000).toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">Cleared</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Fee Payment Modal (Admin) */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Offline Fee Payment"
        description="Log bank challan, NEFT, or demand draft collection into the central ledger."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Student Roll Number</label>
            <input
              type="text"
              value={recordForm.studentRoll}
              onChange={(e) => setRecordForm({ ...recordForm, studentRoll: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 font-mono text-slate-800 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Amount Collected (₹)</label>
              <input
                type="number"
                value={recordForm.amount}
                onChange={(e) => setRecordForm({ ...recordForm, amount: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 p-2 font-mono text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Receipt Identifier</label>
              <input
                type="text"
                value={recordForm.receiptNo}
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-slate-600 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsRecordModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsRecordModalOpen(false)}
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e]"
            >
              Record Payment Entry
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
