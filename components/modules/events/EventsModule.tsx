'use client'

import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  Download,
  MapPin,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react'
import { mockCampusEvents } from '@/lib/mock-data'
import { CampusEvent } from '@/types'

export function EventsModule() {
  const [events, setEvents] = useState<CampusEvent[]>(mockCampusEvents)
  const [filter, setFilter] = useState<'All' | 'Technical' | 'Academic' | 'Sports'>('All')
  const [registeredIds, setRegisteredIds] = useState<string[]>([])

  const filtered = events.filter((e) => (filter === 'All' ? true : e.category === filter))

  const handleRegister = (id: string) => {
    if (registeredIds.includes(id)) {
      setRegisteredIds(registeredIds.filter((item) => item !== id))
    } else {
      setRegisteredIds([...registeredIds, id])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Campus Events & Technical Symposia</h2>
          <p className="text-xs text-slate-500">
            Hackathons, guest lectures, cultural fests, and athletic tournaments
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto">
          {(['All', 'Technical', 'Academic', 'Sports'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === cat
                  ? 'bg-[#1b4d9b] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((evt) => {
          const isRegistered = registeredIds.includes(evt.id)
          return (
            <div
              key={evt.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                    {evt.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {evt.registeredCount} / {evt.capacity} registered
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug">{evt.title}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5 text-slate-400 shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-slate-400 shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {evt.organizer}
                </span>

                <button
                  onClick={() => handleRegister(evt.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isRegistered
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-[#1b4d9b] text-white hover:bg-[#153e7e]'
                  }`}
                >
                  {isRegistered ? '✓ Registered' : 'RSVP / Register'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
