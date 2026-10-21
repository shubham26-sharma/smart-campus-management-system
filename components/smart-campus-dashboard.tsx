'use client'

import React, { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  WalletCards,
  X,
} from 'lucide-react'
import { AdminDashboard } from '@/components/dashboards/AdminDashboard'
import { FacultyDashboard } from '@/components/dashboards/FacultyDashboard'
import { HODDashboard } from '@/components/dashboards/HODDashboard'
import { ManagementDashboard } from '@/components/dashboards/ManagementDashboard'
import { StudentDashboard } from '@/components/dashboards/StudentDashboard'
import { AcademicsModule } from '@/components/modules/academics/AcademicsModule'
import { AssignmentsModule } from '@/components/modules/assignments/AssignmentsModule'
import { CampusAssistantModal } from '@/components/modules/assistant/CampusAssistantModal'
import { AttendanceModule } from '@/components/modules/attendance/AttendanceModule'
import { ComplaintsModule } from '@/components/modules/complaints/ComplaintsModule'
import { EventsModule } from '@/components/modules/events/EventsModule'
import { ExaminationsModule } from '@/components/modules/examinations/ExaminationsModule'
import { FacultyModule } from '@/components/modules/faculty/FacultyModule'
import { FeesModule } from '@/components/modules/fees/FeesModule'
import { NoticesModule } from '@/components/modules/notices/NoticesModule'
import { NotificationsDrawer } from '@/components/modules/notifications/NotificationsDrawer'
import { ProfileModule } from '@/components/modules/profile/ProfileModule'
import { ReportsModule } from '@/components/modules/reports/ReportsModule'
import { GlobalSearchModal } from '@/components/modules/search/GlobalSearchModal'
import { StudentsModule } from '@/components/modules/students/StudentsModule'
import { TimetableModule } from '@/components/modules/timetable/TimetableModule'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Role } from '@/types'

type Icon = typeof LayoutDashboard
type NavItem = { label: string; icon: Icon }

const roleConfig: Record<Role, { description: string; nav: NavItem[] }> = {
  Management: {
    description: 'Institution-wide performance, academic outcomes, and authorized reports.',
    nav: [
      { label: 'Overview', icon: LayoutDashboard },
      { label: 'Departments', icon: Building2 },
      { label: 'Analytics', icon: ClipboardCheck },
      { label: 'Reports', icon: FileText },
      { label: 'Notices', icon: Bell },
      { label: 'Complaints', icon: MessageSquare },
      { label: 'Fee records', icon: WalletCards },
    ],
  },
  HOD: {
    description: 'CSE department operations, faculty workload, and academic progress.',
    nav: [
      { label: 'Department overview', icon: LayoutDashboard },
      { label: 'Faculty', icon: GraduationCap },
      { label: 'Classes', icon: Users },
      { label: 'Subjects', icon: BookOpen },
      { label: 'Timetable', icon: CalendarDays },
      { label: 'Attendance analytics', icon: ClipboardCheck },
      { label: 'Reports', icon: FileText },
      { label: 'Notices', icon: Bell },
    ],
  },
  Admin: {
    description: 'Manage academic records, accounts, schedules, notices, and services.',
    nav: [
      { label: 'Overview', icon: LayoutDashboard },
      { label: 'Students', icon: Users },
      { label: 'Faculty', icon: GraduationCap },
      { label: 'Departments', icon: Building2 },
      { label: 'Classes', icon: BookOpen },
      { label: 'Timetable', icon: CalendarDays },
      { label: 'Notices', icon: Bell },
      { label: 'Complaints', icon: MessageSquare },
      { label: 'Fee records', icon: WalletCards },
      { label: 'Settings', icon: Settings },
    ],
  },
  Faculty: {
    description: 'Your classes, attendance queue, assignments, and examination tasks.',
    nav: [
      { label: 'Overview', icon: LayoutDashboard },
      { label: 'My timetable', icon: CalendarDays },
      { label: 'My classes', icon: Users },
      { label: 'Mark attendance', icon: ClipboardCheck },
      { label: 'Attendance history', icon: FileText },
      { label: 'Assignments', icon: BookOpen },
      { label: 'Submissions', icon: CheckCircle2 },
      { label: 'Examinations', icon: ShieldCheck },
      { label: 'Notices', icon: Bell },
    ],
  },
  Student: {
    description: 'Your timetable, attendance, assignments, results, and campus services.',
    nav: [
      { label: 'Overview', icon: LayoutDashboard },
      { label: 'My timetable', icon: CalendarDays },
      { label: 'My attendance', icon: ClipboardCheck },
      { label: 'Assignments', icon: BookOpen },
      { label: 'Examinations', icon: ShieldCheck },
      { label: 'Results', icon: FileText },
      { label: 'Notices', icon: Bell },
      { label: 'Complaints', icon: MessageSquare },
      { label: 'Fee status', icon: WalletCards },
      { label: 'Campus events', icon: Sparkles },
    ],
  },
}

export function SmartCampusDashboard({ initialTab }: { initialTab?: string }) {
  const {
    role,
    setRole,
    currentUser,
    activeTab,
    setActiveTab,
    setSearchOpen,
    setAssistantOpen,
    setNotificationsOpen,
    unreadNotificationsCount,
  } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  // Sync initialTab if provided via prop
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab, setActiveTab])

  const config = roleConfig[role]
  const displayActive =
    config.nav.find((item) => item.label.toLowerCase() === activeTab.toLowerCase())?.label ??
    activeTab

  const pageTitle =
    displayActive === 'Overview' || displayActive.endsWith('overview')
      ? `${role} dashboard`
      : displayActive

  const isAttendanceTab =
    displayActive.toLowerCase().includes('attendance') || displayActive === 'Mark attendance'

  const selectRole = (next: Role) => {
    setRole(next)
    setProfileDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  // Active Main Content Component Resolver
  const renderContent = () => {
    const act = displayActive.toLowerCase()

    if (act === 'overview' || act === 'department overview') {
      switch (role) {
        case 'Management':
          return <ManagementDashboard />
        case 'HOD':
          return <HODDashboard />
        case 'Admin':
          return <AdminDashboard />
        case 'Faculty':
          return <FacultyDashboard />
        case 'Student':
          return <StudentDashboard />
      }
    }

    if (
      act.includes('attendance') ||
      act === 'mark attendance' ||
      act === 'my attendance' ||
      act === 'attendance history'
    ) {
      return <AttendanceModule />
    }

    if (act === 'students' || act === 'my classes') {
      return <StudentsModule />
    }

    if (act === 'faculty') {
      return <FacultyModule />
    }

    if (act === 'departments' || act === 'classes' || act === 'subjects') {
      return <AcademicsModule />
    }

    if (act === 'timetable' || act === 'my timetable') {
      return <TimetableModule />
    }

    if (act === 'assignments' || act === 'submissions') {
      return <AssignmentsModule />
    }

    if (act === 'examinations' || act === 'results') {
      return <ExaminationsModule />
    }

    if (act === 'notices') {
      return <NoticesModule />
    }

    if (act === 'complaints') {
      return <ComplaintsModule />
    }

    if (act === 'fee records' || act === 'fee status') {
      return <FeesModule />
    }

    if (act === 'campus events') {
      return <EventsModule />
    }

    if (act === 'reports' || act === 'analytics') {
      return <ReportsModule />
    }

    if (act === 'settings' || act === 'profile') {
      return <ProfileModule />
    }

    // Default Fallback
    return <AttendanceModule />
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT COLLAPSIBLE SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Logo & Title */}
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#152a55] text-white shadow-xs">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#152a55] leading-tight">Smart Campus</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
              Academic ERP
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto rounded-lg p-1 text-slate-400 hover:text-slate-600 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {role} workspace
          </p>
          <nav className="flex flex-col gap-1" aria-label="Primary navigation">
            {config.nav.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveTab(label)
                  setMobileMenuOpen(false)
                }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
                  displayActive === label
                    ? 'bg-[#eaf0fb] text-[#1b4d9b] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon className="size-[17px] shrink-0" />
                <span className="truncate">{label}</span>
                {label === 'Complaints' && (
                  <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    6
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Campus Assistant Widget Box */}
        <div className="m-3 rounded-xl bg-[#f0f5ff] p-3.5 border border-blue-100/60 shadow-2xs">
          <div className="mb-2 flex items-center gap-2 text-[#1b4d9b]">
            <Sparkles className="size-4" />
            <span className="text-xs font-bold">Campus assistant</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Ask about notices, schedules, attendance, or campus services.
          </p>
          <button
            onClick={() => setAssistantOpen(true)}
            className="mt-3 flex items-center text-[11px] font-bold text-[#1b4d9b] hover:underline"
          >
            Ask AI Assistant <ArrowUpRight className="ml-1 inline size-3" />
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN HEADER & CONTENT SHELL */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:pl-[252px]">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span className="font-medium text-slate-500">Smart Campus</span>
              <span>/</span>
              <span className="font-semibold text-slate-800">{displayActive}</span>
            </div>
            <p className="text-sm font-bold text-[#152a55] sm:hidden">Smart Campus</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Global Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 hover:border-slate-300 md:flex transition-colors"
            >
              <Search className="size-4 text-slate-400" />
              <span>Search anything</span>
              <kbd className="ml-2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="size-[18px]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500" />
              )}
            </button>

            <div className="h-7 w-px bg-slate-200" />

            {/* Profile & Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-slate-50 transition-colors"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-[#dbe8ff] text-xs font-bold text-[#1b4d9b]">
                  {currentUser.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-slate-400">{role} View</span>
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Switch Role View
                    </p>
                    <p className="text-[11px] text-slate-500">Test different user perspectives</p>
                  </div>

                  <div className="py-1">
                    {(['Management', 'HOD', 'Admin', 'Faculty', 'Student'] as Role[]).map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => selectRole(item)}
                          className={cn(
                            'w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors flex items-center justify-between',
                            role === item
                              ? 'bg-blue-50 font-bold text-[#1b4d9b]'
                              : 'text-slate-600 hover:bg-slate-50'
                          )}
                        >
                          <span>{item} View</span>
                          {role === item && <span className="size-1.5 rounded-full bg-[#1b4d9b]" />}
                        </button>
                      )
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab('Profile')
                        setProfileDropdownOpen(false)
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="size-3.5 text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* 3. MAIN WORKSPACE AREA */}
        {/* ------------------------------------------------------------- */}
        <main className="mx-auto max-w-[1440px] p-4 sm:p-8">
          {/* Page Title & Context Header */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#3571c9]">
                Monday, October 20, 2026 · Academic Session 2026–2027
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                {pageTitle}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isAttendanceTab
                  ? 'Review attendance records within your authorized scope.'
                  : config.description}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50 transition-colors"
              >
                Export report
              </button>
              {role === 'Faculty' && isAttendanceTab && (
                <button
                  onClick={() => setActiveTab('Mark attendance')}
                  className="rounded-lg bg-[#1b4d9b] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#153e7e] transition-colors"
                >
                  Save attendance
                </button>
              )}
            </div>
          </div>

          {/* Module Content */}
          {renderContent()}

          {/* Development API Connection Banner */}
          <div className="mt-8 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs text-blue-800">
            <Sparkles className="size-4 shrink-0 text-[#1b4d9b]" />
            <span>
              Connected via Smart Campus API Client. Fast development adapter active for offline
              mode; connects seamlessly to FastAPI at{' '}
              <code className="font-mono font-bold">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}
              </code>
              .
            </span>
          </div>
        </main>
      </div>

      {/* Global Interactive Overlays */}
      <GlobalSearchModal />
      <CampusAssistantModal />
      <NotificationsDrawer />
    </div>
  )
}
