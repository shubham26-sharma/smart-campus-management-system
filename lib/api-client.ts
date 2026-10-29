import {
  Assignment,
  AttendanceRecord,
  CampusEvent,
  ClassSession,
  Complaint,
  Department,
  Examination,
  Faculty,
  FeeRecord,
  Notice,
  NotificationItem,
  Role,
  Student,
  StudentResult,
  Subject,
  SubjectAttendanceSummary,
  TimetableSlot,
  User,
} from '@/types'
import {
  mockAssignments,
  mockCampusEvents,
  mockClasses,
  mockComplaints,
  mockDepartments,
  mockExaminations,
  mockFaculty,
  mockFeeRecord,
  mockNotices,
  mockNotifications,
  mockRecentAttendanceRecords,
  mockStudentAttendanceBreakdown,
  mockStudentResult,
  mockStudents,
  mockSubjects,
  mockTimetable,
  mockUsers,
} from './mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
  isMock?: boolean
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3500)

  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    const token = typeof window !== 'undefined' ? localStorage.getItem('smartcampus_token') : null

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { data, status: response.status, isMock: false }
  } catch (error) {
    if (fallbackData === undefined) {
      throw error
    }

    // Graceful fallback to development mock data adapter
    return {
      data: fallbackData,
      status: 200,
      message: 'Loaded from local development adapter (backend API unreachable or offline)',
      isMock: true,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

export const apiClient = {
  // Authentication & Profile
  getCurrentUser: async (role: Role = 'Management') => {
    return request<User>(`/auth/me?role=${role}`, {}, mockUsers[role])
  },

  // Students
  getStudents: async (params?: { department?: string; section?: string; search?: string }) => {
    let list = [...mockStudents]
    if (params?.search) {
      const q = params.search.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      )
    }
    return request<Student[]>('/students', {}, list)
  },

  getStudentById: async (id: string) => {
    const student = mockStudents.find((s) => s.id === id) || mockStudents[0]
    return request<Student>(`/students/${id}`, {}, student)
  },

  // Faculty
  getFacultyList: async () => {
    return request<Faculty[]>('/faculty', {}, mockFaculty)
  },

  // Academics: Departments, Classes, Subjects
  getDepartments: async () => {
    return request<Department[]>('/departments', {}, mockDepartments)
  },

  getClasses: async () => {
    return request<ClassSession[]>('/classes', {}, mockClasses)
  },

  getSubjects: async () => {
    return request<Subject[]>('/subjects', {}, mockSubjects)
  },

  // Timetable
  getTimetable: async (day?: string) => {
    let list = [...mockTimetable]
    if (day && day !== 'All') {
      list = list.filter((slot) => slot.day.toLowerCase() === day.toLowerCase())
    }
    return request<TimetableSlot[]>('/timetable', {}, list)
  },

  // Attendance
  getStudentAttendanceSummary: async (studentId: string = 'stu-01', _month: string = '10-2026') => {
    return request<SubjectAttendanceSummary[]>(
      `/attendance/student/${studentId}`,
      {},
      mockStudentAttendanceBreakdown
    )
  },

  getRecentAttendanceRecords: async () => {
    return request<AttendanceRecord[]>('/attendance/recent', {}, mockRecentAttendanceRecords)
  },

  saveAttendance: async (payload: {
    date: string
    lectureSession: string
    classId: string
    subjectId: string
    entries: { studentId: string; rollNumber: string; studentName: string; status: 'Present' | 'Absent' }[]
  }) => {
    return request<AttendanceRecord>(
      '/attendance/mark',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      undefined
    )
  },

  // Assignments
  getAssignments: async () => {
    return request<Assignment[]>('/assignments', {}, mockAssignments)
  },

  // Examinations & Results
  getExaminations: async () => {
    return request<Examination[]>('/examinations', {}, mockExaminations)
  },

  getStudentResult: async (studentId: string = 'stu-01') => {
    const fallback = studentId === mockStudentResult.studentId ? mockStudentResult : undefined
    return request<StudentResult>(`/results/student/${studentId}`, {}, fallback)
  },

  // Notices
  getNotices: async (category?: string) => {
    let list = [...mockNotices]
    if (category && category !== 'All') {
      list = list.filter((n) => n.category.toLowerCase() === category.toLowerCase())
    }
    return request<Notice[]>('/notices', {}, list)
  },

  // Complaints
  getComplaints: async (userRole?: Role) => {
    let list = [...mockComplaints]
    if (userRole === 'Student') {
      list = list.filter((c) => c.submittedByRole === 'Student')
    }
    return request<Complaint[]>('/complaints', {}, list)
  },

  submitComplaint: async (payload: {
    subject: string
    description: string
    category: Complaint['category']
    priority: Complaint['priority']
    submittedBy: string
    submittedByRole: Role
  }) => {
    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      ticketId: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      subject: payload.subject,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      status: 'Submitted',
      submittedBy: payload.submittedBy,
      submittedByRole: payload.submittedByRole,
      submittedAt: 'Just now',
      updatedAt: 'Just now',
    }
    return request<Complaint>(
      '/complaints',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      newComplaint
    )
  },

  // Fees
  getFeeRecord: async (studentId: string = 'stu-01') => {
    const fallback = studentId === mockFeeRecord.studentId ? mockFeeRecord : undefined
    return request<FeeRecord>(`/fees/student/${studentId}`, {}, fallback)
  },

  // Events
  getCampusEvents: async () => {
    return request<CampusEvent[]>('/events', {}, mockCampusEvents)
  },

  // Notifications
  getNotifications: async () => {
    return request<NotificationItem[]>('/notifications', {}, mockNotifications)
  },
}
