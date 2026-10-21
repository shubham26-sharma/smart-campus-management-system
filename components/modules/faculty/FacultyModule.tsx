'use client'

import React, { useMemo, useState } from 'react'
import {
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  Eye,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Search,
  UserCheck,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import { mockFaculty } from '@/lib/mock-data'
import { Faculty } from '@/types'

export function FacultyModule() {
  const { role } = useAuth()
  const isAuthorized = ['Admin', 'HOD', 'Management'].includes(role)

  const [facultyList, setFacultyList] = useState<Faculty[]>(mockFaculty)
  const [search, setSearch] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Add Faculty Form State
  const [form, setForm] = useState({
    name: '',
    empId: '',
    email: '',
    phone: '',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor',
    qualification: 'M.Tech',
    workloadHours: 14,
  })

  const filtered = useMemo(() => {
    if (!search.trim()) return facultyList
    const q = search.toLowerCase()
    return facultyList.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.empId.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q)
    )
  }, [search, facultyList])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.empId || !form.email) return

    const newFaculty: Faculty = {
      id: `fac-${Date.now()}`,
      empId: form.empId.toUpperCase(),
      name: form.name,
      email: form.email,
      department: form.department,
      designation: form.designation,
      qualification: form.qualification,
      subjects: ['CS501 Design & Analysis of Algorithms'],
      workloadHours: Number(form.workloadHours),
      status: 'Active',
      phone: form.phone || '+91 98000 00000',
    }

    setFacultyList([newFaculty, ...facultyList])
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Faculty & Staff Directory</h2>
          <p className="text-xs text-slate-500">
            Teaching faculty, subject allocations, and weekly teaching workloads
          </p>
        </div>

        {isAuthorized && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]"
          >
            <Plus className="size-3.5" /> Appoint Faculty
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="relative max-w-sm">
          <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty by name, employee ID, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1b4d9b]"
          />
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((fac) => (
          <div
            key={fac.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#1b4d9b] font-bold text-sm">
                  {fac.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {fac.status}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900">{fac.name}</h3>
                <p className="text-xs font-semibold text-[#1b4d9b]">{fac.designation}</p>
                <p className="text-[11px] text-slate-400">{fac.department}</p>
              </div>

              <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                  <GraduationCap className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{fac.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                  <Briefcase className="size-3.5 text-slate-400 shrink-0" />
                  <span>Workload: {fac.workloadHours} hrs/week</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{fac.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-slate-400">{fac.empId}</span>
              <button
                onClick={() => setSelectedFaculty(fac)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Eye className="size-3" /> View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Faculty Profile Modal */}
      {selectedFaculty && (
        <Modal
          isOpen={!!selectedFaculty}
          onClose={() => setSelectedFaculty(null)}
          title={selectedFaculty.name}
          description={`${selectedFaculty.empId} · ${selectedFaculty.designation}`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-bold text-slate-800">{selectedFaculty.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Qualification:</span>
                <span className="font-semibold text-slate-800">{selectedFaculty.qualification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Official Email:</span>
                <span className="font-semibold text-slate-800">{selectedFaculty.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold text-slate-800">{selectedFaculty.phone}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-2">Assigned Courses & Labs</h4>
              <div className="space-y-1.5">
                {selectedFaculty.subjects.map((sub, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5"
                  >
                    <span className="font-semibold text-slate-800">{sub}</span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                      4 hrs/wk
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Faculty Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Appoint New Faculty Member"
        description="Register a new academic staff member into the university ERP."
      >
        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name & Salutation *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Harish Chandra"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Employee ID *</label>
              <input
                type="text"
                required
                placeholder="EMP-CSE-025"
                value={form.empId}
                onChange={(e) => setForm({ ...form, empId: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 font-mono outline-none focus:border-[#1b4d9b]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <select
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              >
                <option>Assistant Professor</option>
                <option>Associate Professor</option>
                <option>Professor</option>
                <option>Adjunct Faculty</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Qualification</label>
              <input
                type="text"
                placeholder="Ph.D (IIT Kanpur)"
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Workload (Hours/Week)</label>
              <input
                type="number"
                value={form.workloadHours}
                onChange={(e) => setForm({ ...form, workloadHours: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
            <input
              type="email"
              required
              placeholder="faculty@smartcampus.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e]"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
