'use client'

import React, { useState } from 'react'
import {
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  ClipboardCheck,
  MessageSquare,
  ShieldAlert,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { mockNotifications } from '@/lib/mock-data'
import { NotificationItem } from '@/types'

export function NotificationsDrawer() {
  const { notificationsOpen, setNotificationsOpen, setUnreadNotificationsCount } = useAuth()
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  if (!notificationsOpen) return null

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadNotificationsCount(0)
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    setUnreadNotificationsCount((prev) => Math.max(0, prev - 1))
  }

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true))

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'assignment':
        return BookOpen
      case 'attendance':
        return ClipboardCheck
      case 'complaint':
        return MessageSquare
      case 'notice':
        return Bell
      default:
        return ShieldAlert
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs transition-opacity"
        onClick={() => setNotificationsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex flex-col h-full w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1b4d9b]">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="rounded-lg p-1.5 text-xs text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <CheckCheck className="size-4" />
            </button>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 border-b border-slate-100 px-5 py-2.5 bg-slate-50/50">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Unread ({notifications.filter((n) => !n.isRead).length})
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No notifications to display
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = getIcon(item.type)
              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-4 transition-colors ${
                    !item.isRead ? 'bg-blue-50/30' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      !item.isRead
                        ? 'bg-blue-100 text-[#1b4d9b]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-xs ${
                          !item.isRead
                            ? 'font-bold text-slate-900'
                            : 'font-semibold text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          title="Mark as read"
                          className="shrink-0 p-1 text-slate-400 hover:text-blue-600"
                        >
                          <Check className="size-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="mt-2 block text-[10px] text-slate-400 font-medium">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
