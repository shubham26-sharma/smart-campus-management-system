export type Role = 'Management' | 'HOD' | 'Admin' | 'Faculty' | 'Student'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department: string
  avatar?: string
  rollNumber?: string
  designation?: string
  semester?: string
  phone?: string
}

export interface Student {
  id: string
  rollNumber: string
  name: string
  email: string
  department: string
  semester: string
  section: string
  attendancePercentage: number
  cgpa: number
  feeStatus: 'Paid' | 'Partial' | 'Overdue'
  status: 'Active' | 'Suspended' | 'On Leave'
  phone: string
  admissionYear: number
}

export interface Faculty {
  id: string
  empId: string
  name: string
  email: string
  department: string
  designation: string
  qualification: string
  subjects: string[]
  workloadHours: number
  status: 'Active' | 'On Leave'
  phone: string
}

export interface Department {
  id: string
  code: string
  name: string
  hodName: string
  hodEmail: string
  facultyCount: number
  studentCount: number
  establishedYear: number
  activePrograms: string[]
}

export interface ClassSession {
  id: string
  name: string
  department: string
  semester: string
  section: string
  batch: string
  studentCount: number
  classTeacher: string
  room: string
}

export interface Subject {
  id: string
  code: string
  name: string
  department: string
  semester: string
  credits: number
  type: 'Theory' | 'Practical'
  facultyId: string
  facultyName: string
}

export interface TimetableSlot {
  id: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  startTime: string
  endTime: string
  subjectCode: string
  subjectName: string
  facultyName: string
  room: string
  section: string
}

export interface AttendanceRecord {
  id: string
  date: string
  lectureSession: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  totalStudents: number
  presentCount: number
  absentCount: number
  markedBy: string
  markedAt: string
}

export interface StudentAttendanceEntry {
  studentId: string
  rollNumber: string
  studentName: string
  status: 'Present' | 'Absent'
  remarks?: string
}

export interface SubjectAttendanceSummary {
  subjectCode: string
  subjectName: string
  facultyName: string
  classesConducted: number
  classesAttended: number
  percentage: number | null // null when 0 conducted
}

export interface Assignment {
  id: string
  title: string
  subjectCode: string
  subjectName: string
  className: string
  dueDate: string
  assignedDate: string
  totalMarks: number
  description: string
  attachments?: string[]
  submissionsCount: number
  totalStudents: number
  status: 'Draft' | 'Published' | 'Closed'
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  rollNumber: string
  submittedAt: string
  status: 'Submitted' | 'Late' | 'Graded' | 'Pending'
  marksObtained?: number
  feedback?: string
  fileName?: string
}

export interface Examination {
  id: string
  title: string
  academicSession: string
  semester: string
  startDate: string
  endDate: string
  type: 'Mid-Semester' | 'End-Semester' | 'Practical'
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Results Published'
  schedule: {
    date: string
    time: string
    subjectCode: string
    subjectName: string
    room: string
  }[]
}

export interface StudentResult {
  id: string
  studentId: string
  studentName: string
  rollNumber: string
  semester: string
  academicSession: string
  subjects: {
    code: string
    name: string
    credits: number
    internalMarks: number
    externalMarks: number
    totalMarks: number
    grade: string
    points: number
  }[]
  sgpa: number
  cgpa: number
  status: 'Published' | 'Draft'
  publishedDate: string
}

export interface Notice {
  id: string
  title: string
  content: string
  category: 'Academic' | 'Exams' | 'Events' | 'Urgent' | 'Administrative'
  audience: 'All' | 'Faculty' | 'Students' | 'HOD'
  department?: string
  publishedDate: string
  expiryDate?: string
  isPinned: boolean
  authorName: string
  authorRole: string
}

export interface Complaint {
  id: string
  ticketId: string
  subject: string
  description: string
  category: 'Academic' | 'Hostel' | 'Infrastructure' | 'Accounts' | 'Library' | 'IT & Lab'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed'
  submittedBy: string
  submittedByRole: Role
  submittedAt: string
  assignedTo?: string
  resolutionNotes?: string
  updatedAt: string
}

export interface FeeRecord {
  id: string
  studentId: string
  studentName: string
  rollNumber: string
  department: string
  semester: string
  academicYear: string
  tuitionFee: number
  labFee: number
  libraryFee: number
  hostelFee?: number
  totalFee: number
  paidAmount: number
  pendingAmount: number
  dueDate: string
  paymentStatus: 'Paid' | 'Partial' | 'Overdue'
  receiptNumber?: string
  lastPaymentDate?: string
}

export interface CampusEvent {
  id: string
  title: string
  category: 'Technical' | 'Cultural' | 'Sports' | 'Academic' | 'Workshop'
  date: string
  time: string
  venue: string
  description: string
  organizer: string
  registrationOpen: boolean
  capacity: number
  registeredCount: number
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  isRead: boolean
  type: 'notice' | 'assignment' | 'result' | 'attendance' | 'complaint' | 'system'
  link?: string
}
