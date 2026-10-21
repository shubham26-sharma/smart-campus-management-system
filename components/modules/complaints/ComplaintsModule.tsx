'use client'

import React, { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  User,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import { mockComplaints } from '@/lib/mock-data'
import { Complaint } from '@/types'

export function ComplaintsModule() {
  const { role, currentUser } = useAuth()
  const isStaff = ['Admin', 'HOD', 'Management'].includes(role)

  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null)
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)

  // New Complaint State
  const [form, setForm] = useState({
    subject: '',
    category: 'IT & Lab' as Complaint['category'],
    priority: 'Medium' as Complaint['priority'],
    description: '',
  })

  // Staff Resolution / Status Update State
  const [updatingTicket, setUpdatingTicket] = useState<Complaint | null>(null)
  const [newStatus, setNewStatus] = useState<Complaint['status']>('In Progress')
  const [resolutionNotes, setResolutionNotes] = useState('')

  // Privacy Rule: Students must only see their own submitted complaints
  const visibleComplaints = useMemo(() => {
    if (role === 'Student') {
      return complaints.filter((c) => c.submittedByRole === 'Student')
    }
    return complaints
  }, [complaints, role])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject.trim() || !form.description.trim()) return

    const newC: Complaint = {
      id: `cmp-${Date.now()}`,
      ticketId: `CMP-2026-0${Math.floor(100 + Math.random() * 900)}`,
      subject: form.subject,
      description: form.description,
      category: form.category,
      priority: form.priority,
      status: 'Submitted',
      submittedBy: currentUser.name,
      submittedByRole: role,
      submittedAt: 'Just now',
      updatedAt: 'Just now',
    }

    setComplaints([newC, ...complaints])
    setIsSubmitOpen(false)
    setForm({
      subject: '',
      category: 'IT & Lab',
      priority: 'Medium',
      description: '',
    })
  }

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault()
    if (!updatingTicket) return

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === updatingTicket.id
          ? {
              ...c,
              status: newStatus,
              resolutionNotes: resolutionNotes || c.resolutionNotes,
              updatedAt: 'Just now',
            }
          : c
      )
    )
    setUpdatingTicket(null)
  }

  const getPriorityStyle = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Medium':
        return 'bg-blue-50 text-[#1b4d9b] border-blue-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusStyle = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return 'bg-emerald-50 text-emerald-700'
      case 'In Progress':
        return 'bg-blue-50 text-[#1b4d9b]'
      case 'Assigned':
      case 'Under Review':
        return 'bg-amber-50 text-amber-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {role === 'Student' ? 'My Grievance & Helpdesk Tickets' : 'Campus Grievance Management Pipeline'}
          </h2>
          <p className="text-xs text-slate-500">
            {role === 'Student'
              ? 'Track resolution for your submitted campus service requests'
              : 'Institutional grievance triage, assignments, and resolution notes'}
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]"
        >
          <Plus className="size-3.5" /> Submit Grievance Ticket
        </button>
      </div>

      {/* Ticket List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1b4d9b]">{c.ticketId}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{c.subject}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{c.description}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{c.category}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${getPriorityStyle(
                        c.priority
                      )}`}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusStyle(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.submittedBy}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedTicket(c)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Details
                      </button>
                      {isStaff && (
                        <button
                          onClick={() => {
                            setUpdatingTicket(c)
                            setNewStatus(c.status)
                            setResolutionNotes(c.resolutionNotes || '')
                          }}
                          className="rounded-lg bg-[#1b4d9b] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#153e7e]"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket ${selectedTicket.ticketId}: ${selectedTicket.subject}`}
          description={`Filed on ${selectedTicket.submittedAt} · Category: ${selectedTicket.category}`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${getStatusStyle(
                    selectedTicket.status
                  )}`}
                >
                  {selectedTicket.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priority Level:</span>
                <span className="font-semibold text-slate-800">{selectedTicket.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Technician:</span>
                <span className="font-semibold text-slate-800">
                  {selectedTicket.assignedTo || 'Unassigned / Under Triage'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-1">Issue Description</h4>
              <p className="text-slate-600 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>

            {selectedTicket.resolutionNotes && (
              <div>
                <h4 className="font-bold text-emerald-800 mb-1">Resolution Summary</h4>
                <p className="text-emerald-900 bg-emerald-50 p-3 rounded-lg border border-emerald-200/60 leading-relaxed">
                  {selectedTicket.resolutionNotes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Staff Update Status Modal */}
      {updatingTicket && (
        <Modal
          isOpen={!!updatingTicket}
          onClose={() => setUpdatingTicket(null)}
          title={`Update Ticket: ${updatingTicket.ticketId}`}
          description="Advance grievance workflow or append resolution notes."
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Workflow Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              >
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Resolution / Action Notes</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Details of repair, component replacement, or follow-up actions taken..."
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUpdatingTicket(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e]"
              >
                Save Status
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Submit Grievance Modal */}
      <Modal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        title="Lodge Grievance or Service Request"
        description="Direct your query to IT, campus estates, or student welfare committees."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Issue Subject *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ethernet socket faulty in CS Lab 2"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              >
                <option value="IT & Lab">IT & Lab</option>
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Accounts">Accounts</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Include location (hall/lab number), error symptoms, and times observed..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

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
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e]"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
