'use client'

import React, { useMemo, useState } from 'react'
import {
  Bell,
  Calendar,
  Check,
  Eye,
  Filter,
  Pin,
  Plus,
  Search,
  Tag,
  User,
} from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import { mockNotices } from '@/lib/mock-data'
import { Notice } from '@/types'

const CATEGORIES = ['All', 'Academic', 'Exams', 'Events', 'Administrative'] as const

export function NoticesModule() {
  const { role } = useAuth()
  const isAuthorized = ['Admin', 'HOD', 'Management', 'Faculty'].includes(role)

  const [notices, setNotices] = useState<Notice[]>(mockNotices)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // New Notice Form State
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Academic' as Notice['category'],
    audience: 'All' as Notice['audience'],
    isPinned: false,
  })

  const filteredNotices = useMemo(() => {
    let list = notices
    if (selectedCategory !== 'All') {
      list = list.filter((n) => n.category.toLowerCase() === selectedCategory.toLowerCase())
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
    }
    return list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
  }, [notices, selectedCategory, search])

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const newN: Notice = {
      id: `not-${Date.now()}`,
      title: form.title,
      content: form.content,
      category: form.category,
      audience: form.audience,
      department: 'Central Administration',
      publishedDate: new Date().toISOString().split('T')[0],
      isPinned: form.isPinned,
      authorName: role === 'Faculty' ? 'Prof. Arjun Kumar' : 'Dean of Academics',
      authorRole: role,
    }

    setNotices([newN, ...notices])
    setIsCreateOpen(false)
    setForm({
      title: '',
      content: '',
      category: 'Academic',
      audience: 'All',
      isPinned: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Campus Circulars & Official Notices</h2>
          <p className="text-xs text-slate-500">
            Institutional announcements, examination notifications, and student advisories
          </p>
        </div>

        {isAuthorized && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#1b4d9b] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#153e7e]"
          >
            <Plus className="size-3.5" /> Publish Circular
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1b4d9b] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1b4d9b]"
          />
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setActiveNotice(notice)}
            className={`cursor-pointer rounded-xl border p-5 shadow-sm transition-all hover:border-slate-300 ${
              notice.isPinned
                ? 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-white'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                  {notice.category}
                </span>
                <span className="text-[11px] text-slate-400">For: {notice.audience}</span>
              </div>
              {notice.isPinned && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#1b4d9b]">
                  <Pin className="size-3" /> Pinned
                </span>
              )}
            </div>

            <h3 className="mt-2.5 text-sm font-bold text-slate-900 line-clamp-2">{notice.title}</h3>
            <p className="mt-1 text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {notice.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{notice.authorName}</span>
              <span>{notice.publishedDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail Modal */}
      {activeNotice && (
        <Modal
          isOpen={!!activeNotice}
          onClose={() => setActiveNotice(null)}
          title={activeNotice.title}
          description={`Published on ${activeNotice.publishedDate} · ${activeNotice.category}`}
        >
          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                Target Audience: {activeNotice.audience}
              </span>
              <span className="text-[11px] text-slate-500">
                Authorized By: {activeNotice.authorName} ({activeNotice.authorRole})
              </span>
            </div>

            <p className="whitespace-pre-line text-sm text-slate-800">{activeNotice.content}</p>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveNotice(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700"
              >
                Close Notice
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Publish Notice Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Draft Official Notice"
        description="Publish circular across departments or target student cohorts."
      >
        <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Notice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule for Autumn 2026 Practical Viva Examinations"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                <option value="Academic">Academic</option>
                <option value="Exams">Exams</option>
                <option value="Events">Events</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Audience Scope</label>
              <select
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none"
              >
                <option value="All">All Campus</option>
                <option value="Students">Students Only</option>
                <option value="Faculty">Faculty Only</option>
                <option value="HOD">HODs Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notice Body Content *</label>
            <textarea
              rows={4}
              required
              placeholder="Detail the circular announcement, directives, and contact points..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-lg border border-slate-200 p-2 text-slate-800 outline-none focus:border-[#1b4d9b]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPinned"
              checked={form.isPinned}
              onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
              className="rounded text-[#1b4d9b]"
            />
            <label htmlFor="isPinned" className="font-semibold text-slate-700">
              Pin to top of circular board
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white hover:bg-[#153e7e]"
            >
              Publish Circular
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
