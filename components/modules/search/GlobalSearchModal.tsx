'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  BookOpen,
  Calendar,
  GraduationCap,
  Search,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { mockFaculty, mockNotices, mockStudents, mockSubjects } from '@/lib/mock-data'

export function GlobalSearchModal() {
  const { searchOpen, setSearchOpen, setActiveTab } = useAuth()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, setSearchOpen])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()

    const studentMatches = mockStudents
      .filter((s) => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q))
      .map((s) => ({
        type: 'Student',
        title: s.name,
        subtitle: `${s.rollNumber} · ${s.department} (Sem 5)`,
        icon: Users,
        tab: 'Students',
      }))

    const facultyMatches = mockFaculty
      .filter((f) => f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q))
      .map((f) => ({
        type: 'Faculty',
        title: f.name,
        subtitle: `${f.designation} · ${f.department}`,
        icon: GraduationCap,
        tab: 'Faculty',
      }))

    const subjectMatches = mockSubjects
      .filter((sub) => sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q))
      .map((sub) => ({
        type: 'Subject',
        title: `${sub.code}: ${sub.name}`,
        subtitle: `${sub.credits} Credits · Faculty: ${sub.facultyName}`,
        icon: BookOpen,
        tab: 'Subjects',
      }))

    const noticeMatches = mockNotices
      .filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .map((n) => ({
        type: 'Notice',
        title: n.title,
        subtitle: `${n.category} · Published ${n.publishedDate}`,
        icon: Bell,
        tab: 'Notices',
      }))

    return [...studentMatches, ...facultyMatches, ...subjectMatches, ...noticeMatches].slice(0, 8)
  }, [query])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={() => setSearchOpen(false)}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <Search className="size-4.5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, subjects, notices, timetable..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            ESC
          </kbd>
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 sm:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="px-4 py-8 text-center text-xs text-slate-400">
              Type keywords such as <span className="font-semibold text-slate-600">&quot;Algorithms&quot;</span>,{' '}
              <span className="font-semibold text-slate-600">&quot;24CSE118&quot;</span>, or{' '}
              <span className="font-semibold text-slate-600">&quot;Exam&quot;</span>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res, index) => {
                const Icon = res.icon
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTab(res.tab)
                      setSearchOpen(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1b4d9b] group-hover:bg-blue-100">
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {res.title}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{res.subtitle}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[11px] text-slate-500">
          <span>Smart Campus Search Engine</span>
          <span className="flex items-center gap-1">
            Press <kbd className="rounded bg-white px-1 border border-slate-200">↵</kbd> to jump
          </span>
        </div>
      </div>
    </div>
  )
}
