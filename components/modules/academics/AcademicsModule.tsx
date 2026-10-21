'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  Layers,
  Plus,
  Users,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import { mockClasses, mockDepartments, mockFaculty, mockSubjects } from '@/lib/mock-data'
import { Subject } from '@/types'

export function AcademicsModule() {
  const { role } = useAuth()
  const isAuthorized = ['Admin', 'HOD', 'Management'].includes(role)

  const [activeTab, setActiveTab] = useState<'departments' | 'classes' | 'subjects'>('departments')
  const [subjectsList, setSubjectsList] = useState<Subject[]>(mockSubjects)
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)

  // Add Subject Form
  const [newSub, setNewSub] = useState({
    code: '',
    name: '',
    department: 'Computer Science and Engineering',
    semester: 'Semester 5',
    credits: 4,
    type: 'Theory' as 'Theory' | 'Practical',
    facultyId: 'fac-01',
    facultyName: 'Prof. Arjun Kumar',
  })

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSub.code || !newSub.name) return

    const created: Subject = {
      id: `sub-${Date.now()}`,
      code: newSub.code.toUpperCase(),
      name: newSub.name,
      department: newSub.department,
      semester: newSub.semester,
      credits: Number(newSub.credits),
      type: newSub.type,
      facultyId: newSub.facultyId,
      facultyName:
        mockFaculty.find((f) => f.id === newSub.facultyId)?.name || 'Prof. Arjun Kumar',
    }
    setSubjectsList([...subjectsList, created])
    setIsAddSubjectOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Module Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              activeTab === 'departments'
                ? 'bg-[#1b4d9b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="size-3.5" /> Academic Departments
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              activeTab === 'classes'
                ? 'bg-[#1b4d9b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="size-3.5" /> Classes & Sections
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              activeTab === 'subjects'
                ? 'bg-[#1b4d9b] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="size-3.5" /> Subjects & Syllabi
          </button>
        </div>

        {isAuthorized && activeTab === 'subjects' && (
          <button
            onClick={() => setIsAddSubjectOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]"
          >
            <Plus className="size-3.5" /> Add Course Subject
          </button>
        )}
      </div>

      {/* 1. DEPARTMENTS TAB */}
      {activeTab === 'departments' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockDepartments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1b4d9b]">
                    {dept.code}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Est. {dept.establishedYear}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900">{dept.name}</h3>
                <p className="mt-1 text-xs text-slate-500">Head: {dept.hodName}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Faculty</span>
                    <p className="font-bold text-slate-800">{dept.facultyCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Students</span>
                    <p className="font-bold text-slate-800">{dept.studentCount}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {dept.activePrograms.map((prog, i) => (
                    <span
                      key={i}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Status: Accredited</span>
                <span className="font-semibold text-[#1b4d9b]">4-Year Undergrad</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. CLASSES TAB */}
      {activeTab === 'classes' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {mockClasses.map((cls) => (
            <div key={cls.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                    Batch {cls.batch}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">{cls.name}</h3>
                  <p className="text-xs text-slate-500">{cls.department}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {cls.studentCount} Students
                </span>
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Class Mentor:</span>
                  <span className="font-semibold text-slate-800">{cls.classTeacher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Lecture Hall:</span>
                  <span className="font-semibold text-slate-800">{cls.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase font-bold text-slate-400">
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Subject Title</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Assigned Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectsList.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1b4d9b]">{sub.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{sub.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{sub.semester}</td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {sub.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{sub.credits} Units</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{sub.facultyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      <Modal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        title="Register Course Subject"
        description="Add a new syllabus course for CSE B.Tech Semester 5."
      >
        <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject Code *</label>
              <input
                type="text"
                required
                placeholder="CS506"
                value={newSub.code}
                onChange={(e) => setNewSub({ ...newSub, code: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 font-mono text-slate-800 outline-none focus:border-[#1b4d9b]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Credits</label>
              <input
                type="number"
                value={newSub.credits}
                onChange={(e) => setNewSub({ ...newSub, credits: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Compiler Design & LLVM"
              value={newSub.name}
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Course Type</label>
              <select
                value={newSub.type}
                onChange={(e) => setNewSub({ ...newSub, type: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical / Lab</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Faculty</label>
              <select
                value={newSub.facultyId}
                onChange={(e) => setNewSub({ ...newSub, facultyId: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              >
                {mockFaculty.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddSubjectOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e]"
            >
              Save Course
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
