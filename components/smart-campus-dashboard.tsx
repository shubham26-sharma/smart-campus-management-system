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
import { ResultsModule } from '@/components/modules/results/ResultsModule'
import { ReportsModule } from '@/components/modules/reports/ReportsModule'
import { GlobalSearchModal } from '@/components/modules/search/GlobalSearchModal'
import { StudentsModule } from '@/components/modules/students/StudentsModule'
import { TimetableModule } from '@/components/modules/timetable/TimetableModule'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Role } from '@/types'

type Icon = typeof LayoutDashboard
type NavItem = { label: string; icon: Icon }
type NavigationGroup = { label: string; labels: string[] }

const roleConfig: Record<
  Role,
  { description: string; nav: NavItem[]; groups: NavigationGroup[] }
> = {
  Management: {
    description: 'Institution-wide performance, academic outcomes, and authorized reports.',
    groups: [
      { label: 'Institutional outlook', labels: ['Overview', 'Analytics', 'Reports'] },
      { label: 'Campus operations', labels: ['Departments', 'Fee records'] },
      { label: 'Community', labels: ['Notices', 'Complaints'] },
    ],
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
    groups: [
      {
        label: 'Department planning',
        labels: ['Department overview', 'Classes', 'Subjects', 'Timetable'],
      },
      { label: 'People & progress', labels: ['Faculty', 'Attendance analytics'] },
      { label: 'Department communication', labels: ['Reports', 'Notices'] },
    ],
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
    groups: [
      { label: 'Overview', labels: ['Overview'] },
      { label: 'Campus records', labels: ['Students', 'Faculty', 'Departments'] },
      { label: 'Academic operations', labels: ['Classes', 'Timetable'] },
      {
        label: 'Office & services',
        labels: ['Notices', 'Complaints', 'Fee records', 'Settings'],
      },
    ],
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
    groups: [
      { label: 'Teaching day', labels: ['Overview', 'My timetable', 'My classes'] },
      { label: 'Class records', labels: ['Mark attendance', 'Attendance history'] },
      { label: 'Coursework', labels: ['Assignments', 'Submissions', 'Examinations'] },
      { label: 'Campus', labels: ['Notices'] },
    ],
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
    groups: [
      { label: 'My learning', labels: ['Overview', 'My timetable', 'My attendance'] },
      { label: 'Course progress', labels: ['Assignments', 'Examinations', 'Results'] },
      {
        label: 'Campus life',
        labels: ['Notices', 'Complaints', 'Fee status', 'Campus events'],
      },
    ],
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
  const groupedNav = config.groups
    .map((group) => ({
      ...group,
      items: config.nav.filter((item) => group.labels.includes(item.label)),
    }))
    .filter((group) => group.items.length > 0)
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

    if (act === 'examinations') {
      return <ExaminationsModule />
    }

    if (act === 'results') {
      return <ResultsModule />
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
    <div className="min-h-screen bg-[#f6f8fb] font-sans text-[#182230]">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT COLLAPSIBLE SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[#e5eaf1] bg-white shadow-[0_8px_30px_rgba(16,24,40,0.04)] transition-transform duration-200 lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Sidebar navigation"
      >
        {/* Brand Logo & Title */}
        <div className="flex h-[72px] items-center gap-3 border-b border-[#e5eaf1] px-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#152a55] text-white shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight tracking-tight text-[#152a55]">
              Smart Campus
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
              Campus workspace
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
          <div className="mb-5 rounded-xl border border-blue-100 bg-[#f5f8fe] px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Signed in as
            </p>
            <p className="mt-1 truncate text-xs font-semibold text-[#152a55]">{role}</p>
          </div>
          <nav className="space-y-5" aria-label="Primary navigation">
            {groupedNav.map((group) => (
              <section key={group.label}>
                <h2 className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {group.label}
                </h2>
                <div className="flex flex-col gap-1">
                  {group.items.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setActiveTab(label)
                        setMobileMenuOpen(false)
                      }}
                      aria-current={displayActive === label ? 'page' : undefined}
                      className={cn(
                        'flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors',
                        displayActive === label
                          ? 'bg-[#eaf0fb] font-semibold text-[#1b4d9b] shadow-[inset_2px_0_0_#1b4d9b]'
                          : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <Icon className="size-[17px] shrink-0" />
                      <span className="truncate">{label}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </div>

        {/* Campus Assistant Widget Box */}
        <div className="m-3 rounded-xl border border-blue-100 bg-[#f5f8fe] p-3.5">
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
      <div className="lg:pl-[260px]">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#e5eaf1] bg-white/95 px-4 backdrop-blur-md sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span className="font-medium text-slate-500">{role}</span>
              <span>/</span>
              <span className="font-semibold text-slate-800">{displayActive}</span>
            </div>
            <p className="text-sm font-bold text-[#152a55] sm:hidden">Smart Campus</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Global Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search campus"
              className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-xs text-slate-500 transition-colors hover:border-slate-300 md:px-3 md:py-2"
            >
              <Search className="size-4 text-slate-400" />
              <span className="hidden md:inline">Search anything</span>
              <kbd className="ml-2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
                Ctrl K
              </kbd>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
              title="Notifications"
              aria-label={`Notifications${unreadNotificationsCount ? `, ${unreadNotificationsCount} unread` : ''}`}
            >
              <Bell className="size-[18px]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            <div className="h-7 w-px bg-slate-200" />

            {/* Profile & Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((v) => !v)}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
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
        <main className="mx-auto max-w-[1520px] p-4 sm:px-7 sm:py-8">
          {/* Page Title & Context Header */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3571c9]">
                {new Intl.DateTimeFormat('en', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date())}
                {' · Academic Session 2026–2027'}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-[#182230] sm:text-[28px]">
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
        </main>
      </div>

      {/* Global Interactive Overlays */}
      <GlobalSearchModal />
      <CampusAssistantModal />
      <NotificationsDrawer />
    </div>
  )
}
