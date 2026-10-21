'use client'

import React, { useMemo, useState } from 'react'
import {
  Download,
  Eye,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Search,
  UserCheck,
  UserX,
  Users,
  X,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import { mockStudents } from '@/lib/mock-data'
import { Student } from '@/types'

export function StudentsModule() {
  const { role } = useAuth()
  const isAuthorizedToManage = ['Admin', 'HOD', 'Management'].includes(role)

  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave'>('All')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // New Student Form State
  const [form, setForm] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: 'Computer Science and Engineering',
    semester: 'Semester 5',
    section: 'A',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // If Student role, show only their authorized record
  const displayedStudents = useMemo(() => {
    let list = students
    if (role === 'Student') {
      list = list.filter((s) => s.rollNumber === '24CSE118')
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'All') {
      list = list.filter((s) => s.status === statusFilter)
    }
    return list
  }, [students, role, search, statusFilter])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = 'Full name is required'
    if (!form.rollNumber.trim()) errors.rollNumber = 'Roll number is required'
    if (!form.email.trim() || !form.email.includes('@')) errors.email = 'Valid institutional email is required'
    if (!form.phone.trim()) errors.phone = 'Contact number is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      rollNumber: form.rollNumber.toUpperCase(),
      name: form.name,
      email: form.email,
      department: form.department,
      semester: form.semester,
      section: form.section,
      attendancePercentage: 100,
      cgpa: 8.5,
      feeStatus: 'Paid',
      status: 'Active',
      phone: form.phone,
      admissionYear: 2024,
    }

    setStudents([newStudent, ...students])
    setIsAddModalOpen(false)
    setForm({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      department: 'Computer Science and Engineering',
      semester: 'Semester 5',
      section: 'A',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {role === 'Student' ? 'My Student Profile & Academic Record' : 'Student Directory'}
          </h2>
          <p className="text-xs text-slate-500">
            {role === 'Student'
              ? 'Authorized record for Roll No 24CSE118'
              : 'Enrolled candidates in B.Tech Computer Science and Engineering'}
          </p>
        </div>

        {isAuthorizedToManage && (
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Download className="size-3.5" /> Export Roster
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]"
            >
              <Plus className="size-3.5" /> Register Student
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar (shown for staff) */}
      {role !== 'Student' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
      )}

      {/* Student Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Cumulative CGPA</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="block text-[11px] text-slate-400">{s.email}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {s.rollNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {s.semester} · Sec {s.section}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        s.attendancePercentage >= 75
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {s.attendancePercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{s.cgpa}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        s.feeStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {s.feeStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      title="View Student Profile"
                    >
                      <Eye className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Record: ${selectedStudent.name}`}
          description={`${selectedStudent.rollNumber} · ${selectedStudent.department}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Roll Number
                </span>
                <span className="font-bold text-slate-800 font-mono text-sm">
                  {selectedStudent.rollNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Admission Year
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedStudent.admissionYear} (4-Year B.Tech)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Email Address
                </span>
                <span className="font-semibold text-slate-800">{selectedStudent.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Contact Phone
                </span>
                <span className="font-semibold text-slate-800">{selectedStudent.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-slate-200 p-3">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">
                  Attendance
                </span>
                <span className="text-lg font-bold text-emerald-700">
                  {selectedStudent.attendancePercentage}%
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">
                  Current CGPA
                </span>
                <span className="text-lg font-bold text-slate-800">{selectedStudent.cgpa}</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">
                  Fee Status
                </span>
                <span className="text-lg font-bold text-blue-700">{selectedStudent.feeStatus}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Register New Student Modal (Authorized Admin/HOD) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Student Record"
        description="Add a newly admitted student to the CSE Department database."
      >
        <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Student Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Vikram Sharma"
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
            {formErrors.name && <p className="text-rose-600 mt-0.5">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Roll Number *</label>
              <input
                type="text"
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                placeholder="24CSE126"
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 font-mono outline-none focus:border-[#1b4d9b]"
              />
              {formErrors.rollNumber && (
                <p className="text-rose-600 mt-0.5">{formErrors.rollNumber}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98110 00000"
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
              />
              {formErrors.phone && <p className="text-rose-600 mt-0.5">{formErrors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Institutional Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="student.24cse126@smartcampus.edu"
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
            {formErrors.email && <p className="text-rose-600 mt-0.5">{formErrors.email}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e]"
            >
              Save Student Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
