'use client'

import React, { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  MapPin,
  Users,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { mockTimetable } from '@/lib/mock-data'
import { TimetableSlot } from '@/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const

export function TimetableModule() {
  const { role } = useAuth()
  const [selectedDay, setSelectedDay] = useState<string>('Monday')
  const [filterView, setFilterView] = useState<'class' | 'faculty'>('class')

  const daySlots = useMemo(() => {
    return mockTimetable.filter((slot) => slot.day === selectedDay)
  }, [selectedDay])

  return (
    <div className="space-y-6">
      {/* Header & Conflict Free Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {role === 'Faculty' ? 'My Teaching Timetable' : 'B.Tech CSE Weekly Timetable'}
          </h2>
          <p className="text-xs text-slate-500">
            Academic Session 2026–2027 · Semester 5 (Section A) · Room 304, Aryabhatta Block
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span>0 Schedule Conflicts</span>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="size-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2.5">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              selectedDay === day
                ? 'bg-[#1b4d9b] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Period Grid */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Schedule for {selectedDay} (5 Active Periods)
          </h3>
          <span className="text-xs text-slate-500">College Working Hours: 09:00 AM – 05:00 PM</span>
        </div>

        <div className="mt-4 space-y-3">
          {daySlots.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No scheduled lectures for {selectedDay}
            </div>
          ) : (
            daySlots.map((slot, index) => (
              <div
                key={slot.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-[#fbfcfd] p-4 hover:border-slate-300 hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-[#1b4d9b]">Period</span>
                    <span className="text-base font-extrabold text-[#152a55]">0{index + 1}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
                        {slot.subjectCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{slot.subjectName}</h4>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="size-3.5 text-slate-400" />
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-slate-400" />
                        {slot.room}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-slate-800">{slot.facultyName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                    {slot.section}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
