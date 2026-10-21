'use client'

import React, { useState } from 'react'
import {
  ArrowRight,
  Bot,
  Calendar,
  ClipboardCheck,
  FileText,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  time: string
  sources?: string[]
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'assistant',
    text: 'Hello! I am your Smart Campus Assistant. I can help answer questions regarding your B.Tech CSE 2026–2027 timetable, attendance rules, assignment deadlines, examination dates, and campus facilities.',
    time: '10:00 AM',
    sources: ['Smart Campus ERP Handbook 2026–27'],
  },
]

const CANNED_RESPONSES: Record<string, { answer: string; sources: string[] }> = {
  timetable: {
    answer:
      'For B.Tech CSE Semester 5 (Section A), lectures run Monday through Friday from 09:00 AM to 05:00 PM in Aryabhatta Room 304. Today includes Design & Analysis of Algorithms at 10:00 AM and Operating Systems at 09:00 AM.',
    sources: ['CSE 2026-27 Autumn Timetable', 'Room 304 Allocation'],
  },
  attendance: {
    answer:
      'According to academic regulations, all students must maintain at least 75% monthly attendance in each subject to be eligible for the Autumn 2026 Mid-Semester Examinations. Currently, your overall attendance is 91.4% (Healthy).',
    sources: ['Academic Senate Attendance Byelaws 2026'],
  },
  assignment: {
    answer:
      'Upcoming deadlines:\n1. CS501 Dynamic Programming HW — Due Oct 24, 2026 (Prof. Arjun Kumar)\n2. CS502 Multi-threaded OS Challenge — Due Oct 22, 2026 (Dr. Sunita Kulkarni)\n3. CS503 Database Normalization — Due Oct 28, 2026.',
    sources: ['CSE Coursework Portal (Autumn 2026)'],
  },
  exam: {
    answer:
      'The Autumn 2026 Mid-Semester Examinations commence on Monday, November 16, 2026. Hall tickets will be downloadable from the ERP portal beginning November 08, 2026.',
    sources: ['Examination Section Notice EX-2026-08'],
  },
  complaint: {
    answer:
      'To report IT, lab, or hostel concerns, navigate to the Complaints module in the sidebar. You can select your issue category, assign a priority level, and track live status updates until resolution.',
    sources: ['Campus Helpdesk & Grievance Guidelines'],
  },
}

export function CampusAssistantModal() {
  const { assistantOpen, setAssistantOpen, role } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  if (!assistantOpen) return null

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const lower = query.toLowerCase()
      let matched = CANNED_RESPONSES.attendance
      if (lower.includes('timetable') || lower.includes('class') || lower.includes('schedule')) {
        matched = CANNED_RESPONSES.timetable
      } else if (lower.includes('assign') || lower.includes('homework') || lower.includes('due')) {
        matched = CANNED_RESPONSES.assignment
      } else if (lower.includes('exam') || lower.includes('result') || lower.includes('mid-term')) {
        matched = CANNED_RESPONSES.exam
      } else if (lower.includes('complaint') || lower.includes('help') || lower.includes('issue')) {
        matched = CANNED_RESPONSES.complaint
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: matched.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: matched.sources,
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 700)
  }

  const promptSuggestions = [
    'How can I find my timetable?',
    'What is the minimum attendance criteria?',
    'What are my upcoming assignment deadlines?',
    'When do the mid-semester exams begin?',
    'How do I lodge a hostel or lab complaint?',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={() => setAssistantOpen(false)}
        aria-hidden="true"
      />
      <div className="relative flex flex-col h-[600px] w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#f8faff] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1b4d9b] text-white shadow-xs">
              <Sparkles className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Smart Campus Assistant</h3>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-[#1b4d9b]">
                  AI Beta
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Grounding: CSE Session 2026–2027 · {role} scope
              </p>
            </div>
          </div>
          <button
            onClick={() => setAssistantOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-2 text-[11px] text-blue-800 flex items-center gap-2">
          <Bot className="size-3.5 shrink-0" />
          <span>Responses are generated using official Smart Campus institutional policies.</span>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1b4d9b] text-white text-xs">
                  <Bot className="size-3.5" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1b4d9b] text-white rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/70 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-500">Reference: </span>
                    {msg.sources.join(', ')}
                  </div>
                )}
                <span
                  className={`mt-1.5 block text-[9px] text-right ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
              {msg.sender === 'user' && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-xs">
                  <User className="size-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#1b4d9b] text-white text-xs">
                <Bot className="size-3.5" />
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-400 animate-pulse">
                Consulting academic records...
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex gap-1.5 overflow-x-auto no-scrollbar">
          {promptSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item)}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about schedules, attendance, exams, notices..."
            className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1b4d9b]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex size-8.5 items-center justify-center rounded-xl bg-[#1b4d9b] text-white disabled:opacity-40 hover:bg-[#153e7e] transition-colors"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      </div>
    </div>
  )
}
