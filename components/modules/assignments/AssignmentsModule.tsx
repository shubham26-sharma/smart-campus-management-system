'use client'

import React, { useState } from 'react'
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Plus,
  Send,
  Upload,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import { mockAssignments, mockSubmissions } from '@/lib/mock-data'
import { Assignment, AssignmentSubmission } from '@/types'

export function AssignmentsModule() {
  const { role } = useAuth()
  const isFaculty = role === 'Faculty' || role === 'HOD' || role === 'Admin'

  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(mockSubmissions)
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null)

  // Faculty Create Assignment Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newAsg, setNewAsg] = useState({
    title: '',
    subjectCode: 'CS501',
    subjectName: 'Design & Analysis of Algorithms',
    dueDate: '2026-10-31',
    totalMarks: 20,
    description: '',
  })

  // Student Submit Assignment Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [submittingAsg, setSubmittingAsg] = useState<Assignment | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Faculty Grade Submission Modal State
  const [gradingSubm, setGradingSubm] = useState<AssignmentSubmission | null>(null)
  const [enteredMarks, setEnteredMarks] = useState<number>(20)
  const [enteredFeedback, setEnteredFeedback] = useState('')

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAsg.title.trim()) return

    const created: Assignment = {
      id: `asg-${Date.now()}`,
      title: newAsg.title,
      subjectCode: newAsg.subjectCode,
      subjectName: newAsg.subjectName,
      className: 'B.Tech CSE - 5th Sem (Sec A)',
      assignedDate: '2026-10-20',
      dueDate: newAsg.dueDate,
      totalMarks: Number(newAsg.totalMarks),
      description: newAsg.description,
      submissionsCount: 0,
      totalStudents: 62,
      status: 'Published',
    }

    setAssignments([created, ...assignments])
    setIsCreateOpen(false)
    setNewAsg({
      title: '',
      subjectCode: 'CS501',
      subjectName: 'Design & Analysis of Algorithms',
      dueDate: '2026-10-31',
      totalMarks: 20,
      description: '',
    })
  }

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!submittingAsg || !uploadedFileName) return

    const newSubm: AssignmentSubmission = {
      id: `subm-${Date.now()}`,
      assignmentId: submittingAsg.id,
      studentId: 'stu-01',
      studentName: 'Aarav Mehta',
      rollNumber: '24CSE118',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Submitted',
      fileName: uploadedFileName,
    }

    setSubmissions([newSubm, ...submissions.filter((s) => s.assignmentId !== submittingAsg.id)])
    setIsSubmitOpen(false)
    setSubmitSuccess(true)
  }

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gradingSubm) return

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === gradingSubm.id
          ? {
              ...s,
              status: 'Graded',
              marksObtained: enteredMarks,
              feedback: enteredFeedback,
            }
          : s
      )
    )
    setGradingSubm(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isFaculty ? 'Coursework & Assignments Management' : 'My Coursework & Assignments'}
          </h2>
          <p className="text-xs text-slate-500">
            B.Tech Computer Science and Engineering (Autumn 2026)
          </p>
        </div>

        {isFaculty && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]"
          >
            <Plus className="size-3.5" /> Post New Assignment
          </button>
        )}
      </div>

      {submitSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4.5 text-emerald-600" />
            <span className="font-semibold">
              Assignment submission uploaded successfully! Digital receipt generated.
            </span>
          </div>
          <button onClick={() => setSubmitSuccess(false)}>
            <AlertCircle className="size-4 text-emerald-700" />
          </button>
        </div>
      )}

      {/* Assignment List Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {assignments.map((asg) => {
          const mySubm = submissions.find((s) => s.assignmentId === asg.id)
          return (
            <div
              key={asg.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                    {asg.subjectCode} · {asg.totalMarks} Marks
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      asg.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {asg.status}
                  </span>
                </div>

                <h3 className="mt-2.5 text-sm font-bold text-slate-900 line-clamp-1">{asg.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {asg.description}
                </p>

                <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                  <span className="flex items-center gap-1 font-semibold text-rose-700">
                    <Clock className="size-3 text-rose-600" /> Due {asg.dueDate}
                  </span>
                  <span>·</span>
                  <span>{asg.submissionsCount} of {asg.totalStudents} submitted</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {isFaculty ? (
                  <button
                    onClick={() => setSelectedAsg(asg)}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Review Submissions ({asg.submissionsCount})
                  </button>
                ) : mySubm?.status === 'Graded' ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                    Graded: {mySubm.marksObtained} / {asg.totalMarks}
                  </span>
                ) : mySubm ? (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1b4d9b]">
                    ✓ Submitted
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSubmittingAsg(asg)
                      setIsSubmitOpen(true)
                    }}
                    className="rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#153e7e] transition-colors"
                  >
                    Submit Work
                  </button>
                )}

                <span className="text-[11px] text-slate-400">{asg.className}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Review Submissions Modal (Faculty) */}
      {selectedAsg && (
        <Modal
          isOpen={!!selectedAsg}
          onClose={() => setSelectedAsg(null)}
          title={`Submissions: ${selectedAsg.title}`}
          description={`Total marks: ${selectedAsg.totalMarks} · Due: ${selectedAsg.dueDate}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">File</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions
                    .filter((s) => s.assignmentId === selectedAsg.id)
                    .map((subm) => (
                      <tr key={subm.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-800">{subm.studentName}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{subm.rollNumber}</td>
                        <td className="py-3 px-3 text-blue-700 underline truncate max-w-[120px]">
                          {subm.fileName || 'submission.zip'}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              subm.status === 'Graded'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-blue-50 text-[#1b4d9b]'
                            }`}
                          >
                            {subm.status === 'Graded' ? `${subm.marksObtained} Marks` : subm.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setGradingSubm(subm)
                              setEnteredMarks(subm.marksObtained || selectedAsg.totalMarks)
                              setEnteredFeedback(subm.feedback || '')
                            }}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Grade & Feedback
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAsg(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Grade Submission Modal */}
      {gradingSubm && (
        <Modal
          isOpen={!!gradingSubm}
          onClose={() => setGradingSubm(null)}
          title={`Grade Work: ${gradingSubm.studentName}`}
          description={`Roll Number: ${gradingSubm.rollNumber}`}
        >
          <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Marks Awarded</label>
              <input
                type="number"
                min="0"
                max="25"
                value={enteredMarks}
                onChange={(e) => setEnteredMarks(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Evaluator Feedback</label>
              <textarea
                rows={3}
                value={enteredFeedback}
                onChange={(e) => setEnteredFeedback(e.target.value)}
                placeholder="Remarks on correctness, complexity, or styling..."
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGradingSubm(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white"
              >
                Save Grade
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Student Submit Work Modal */}
      {submittingAsg && (
        <Modal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          title={`Submit Work: ${submittingAsg.title}`}
          description={`Due Date: ${submittingAsg.dueDate} · Subject: ${submittingAsg.subjectCode}`}
        >
          <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
            <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center bg-slate-50/50">
              <Upload className="size-8 mx-auto text-slate-400" />
              <p className="mt-2 text-xs font-bold text-slate-800">
                Click or drag submission archive (.zip, .pdf)
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Maximum file size: 25MB</p>
              <input
                type="file"
                className="mt-3 text-xs"
                onChange={(e) => setUploadedFileName(e.target.files?.[0]?.name || 'assignment.zip')}
              />
            </div>

            {uploadedFileName && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2.5 text-blue-800 font-semibold">
                <FileCheck className="size-4" />
                <span>Selected: {uploadedFileName}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSubmitOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!uploadedFileName}
                className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white disabled:opacity-40"
              >
                Upload & Turn In
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Assignment Modal (Faculty) */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Post New Coursework Assignment"
        description="Publish instructions and set deadlines for B.Tech CSE students."
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assignment Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Graph Traversals & Minimum Spanning Trees"
              value={newAsg.title}
              onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={newAsg.subjectCode}
                onChange={(e) => setNewAsg({ ...newAsg, subjectCode: e.target.value })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              >
                <option value="CS501">CS501 Design & Analysis of Algorithms</option>
                <option value="CS502">CS502 Operating Systems</option>
                <option value="CS503">CS503 Database Management Systems</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Maximum Marks</label>
              <input
                type="number"
                value={newAsg.totalMarks}
                onChange={(e) => setNewAsg({ ...newAsg, totalMarks: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Due Deadline</label>
            <input
              type="date"
              value={newAsg.dueDate}
              onChange={(e) => setNewAsg({ ...newAsg, dueDate: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Instructions & Rubrics</label>
            <textarea
              rows={3}
              value={newAsg.description}
              onChange={(e) => setNewAsg({ ...newAsg, description: e.target.value })}
              placeholder="Detail required deliverables, allowed languages, and submission guidelines..."
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white"
            >
              Publish to Students
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
