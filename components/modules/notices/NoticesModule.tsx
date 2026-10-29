'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Bell, Pin, Plus, Search } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api-client'
import { canViewNotice } from '@/lib/notice-visibility'
import { DataSourceIndicator } from '@/components/ui/data-source-indicator'
import { mockDepartments } from '@/lib/mock-data'
import { Notice } from '@/types'

const CATEGORIES: Array<'All' | Notice['category']> = [
  'All',
  'Academic',
  'Exams',
  'Events',
  'Administrative',
]
type NoticeScope = 'campus' | 'hods' | 'department'

export function NoticesModule() {
  const { currentUser, role } = useAuth()
  const canCreatePreview = role === 'Admin' || role === 'Management' || role === 'HOD'
  const [notices, setNotices] = useState<Notice[]>([])
  const [isMock, setIsMock] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Academic' as Notice['category'],
    scope: (role === 'HOD' ? 'department' : 'campus') as NoticeScope,
    department: role === 'HOD' ? currentUser.department : (mockDepartments[0]?.name ?? ''),
    isPinned: false,
  })

  useEffect(() => {
    let active = true
    apiClient.getNotices()
      .then((response) => {
        if (!active) return
        setNotices(response.data)
        setIsMock(response.isMock === true)
      })
      .catch(() => {
        if (active) setError('Notices could not be loaded.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredNotices = useMemo(() => {
    const query = search.trim().toLowerCase()
    return notices
      .filter((notice) => canViewNotice(notice, role, currentUser.department))
      .filter((notice) => selectedCategory === 'All' || notice.category === selectedCategory)
      .filter(
        (notice) =>
          !query ||
          notice.title.toLowerCase().includes(query) ||
          notice.content.toLowerCase().includes(query)
      )
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
  }, [currentUser.department, notices, role, search, selectedCategory])

  const handleCreateNotice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canCreatePreview || !form.title.trim() || !form.content.trim()) return

    const scope = role === 'HOD' ? 'department' : form.scope
    const notice: Notice = {
      id: `preview-${Date.now()}`,
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      audience: scope === 'hods' ? 'HOD' : 'All',
      department: scope === 'department'
        ? role === 'HOD'
          ? currentUser.department
          : form.department
        : undefined,
      publishedDate: new Date().toISOString().slice(0, 10),
      isPinned: form.isPinned,
      authorName: currentUser.name,
      authorRole: role,
    }

    setNotices((current) => [notice, ...current])
    setIsCreateOpen(false)
    setForm({
      title: '',
      content: '',
      category: 'Academic',
      scope: role === 'HOD' ? 'department' : 'campus',
      department: role === 'HOD' ? currentUser.department : (mockDepartments[0]?.name ?? ''),
      isPinned: false,
    })
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Campus notices</h2>
            {isMock && <DataSourceIndicator />}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Notices are filtered to audiences and departments available in your profile.
          </p>
        </div>
        {canCreatePreview && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#1b4d9b] px-3.5 text-xs font-bold text-white hover:bg-[#153e7e]"
          >
            <Plus className="size-3.5" /> Create notice preview
          </button>
        )}
      </header>

      {role === 'Faculty' && (
        <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-900" role="note">
          Class-scoped faculty notice publishing is unavailable because the current notice model and API have no class audience.
        </p>
      )}
      {error && <p className="text-xs text-rose-700" role="alert">{error}</p>}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                selectedCategory === category
                  ? 'bg-[#1b4d9b] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Search notices</span>
          <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notices"
            className="min-h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-xs outline-none focus:border-[#1b4d9b]"
          />
        </label>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-xs text-slate-500">Loading notices…</p>
      ) : filteredNotices.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredNotices.map((notice) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => setActiveNotice(notice)}
              className={`rounded-xl border p-4 text-left transition-colors hover:border-blue-200 ${
                notice.isPinned ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200 bg-white'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#1b4d9b]">
                {notice.category}
              </span>
              {notice.id.startsWith('preview-') && (
                <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-800">
                  Preview
                </span>
              )}
              {notice.isPinned && <Pin className="ml-2 inline size-3 text-[#1b4d9b]" />}
              <h3 className="mt-2 text-sm font-bold text-slate-900">{notice.title}</h3>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-500">{notice.content}</p>
              <span className="mt-3 block border-t border-slate-100 pt-2 text-[10px] text-slate-400">
                {notice.department ? `${notice.department} · ` : ''}{notice.audience} · {notice.publishedDate}
              </span>
            </button>
          ))}
        </div>
      ) : !error ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
          <Bell className="mx-auto size-5 text-slate-400" />
          <p className="mt-2 text-xs font-semibold text-slate-700">No notices for this audience</p>
          <p className="mt-1 text-[11px] text-slate-500">Try another search or category.</p>
        </div>
      ) : null}

      {activeNotice && (
        <Modal
          isOpen
          onClose={() => setActiveNotice(null)}
          title={activeNotice.title}
          description={`${activeNotice.publishedDate} · ${activeNotice.category}`}
        >
          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <p className="text-[11px] text-slate-500">
              Audience: {activeNotice.department ? `${activeNotice.department} · ` : ''}{activeNotice.audience}
            </p>
            <p className="whitespace-pre-line text-sm text-slate-800">{activeNotice.content}</p>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create notice preview"
        description="Preview only. The current API has no notice publishing endpoint."
      >
        <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
          <label className="block font-bold text-slate-700">
            Notice title *
            <input
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-200 p-2 font-normal outline-none focus:border-[#1b4d9b]"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="font-bold text-slate-700">
              Category
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value as Notice['category'] })}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 font-normal"
              >
                {CATEGORIES.filter((category) => category !== 'All').map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            {role === 'HOD' ? (
              <div>
                <span className="font-bold text-slate-700">Department scope</span>
                <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600">
                  {currentUser.department}
                </p>
              </div>
            ) : (
              <label className="font-bold text-slate-700">
                Audience
                <select
                  value={form.scope}
                  onChange={(event) => setForm({ ...form, scope: event.target.value as NoticeScope })}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 font-normal"
                >
                  <option value="campus">All campus</option>
                  <option value="hods">HODs only</option>
                  <option value="department">A department</option>
                </select>
              </label>
            )}
          </div>
          {(role === 'HOD' || form.scope === 'department') && (
            <label className="block font-bold text-slate-700">
              Department
              {role === 'HOD' ? (
                <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2 font-normal text-slate-600">
                  {currentUser.department}
                </p>
              ) : (
                <select
                  value={form.department}
                  onChange={(event) => setForm({ ...form, department: event.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 font-normal"
                >
                  {mockDepartments.map((department) => (
                    <option key={department.id} value={department.name}>{department.name}</option>
                  ))}
                </select>
              )}
            </label>
          )}
          <label className="block font-bold text-slate-700">
            Notice content *
            <textarea
              required
              rows={4}
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-200 p-2 font-normal outline-none focus:border-[#1b4d9b]"
            />
          </label>
          <label className="flex items-center gap-2 font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(event) => setForm({ ...form, isPinned: event.target.checked })}
            />
            Pin preview to the top
          </label>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-[#1b4d9b] px-4 py-2 font-bold text-white">
              Create local preview
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
