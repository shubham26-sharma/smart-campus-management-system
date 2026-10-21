import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Attendance Management | Smart Campus',
  description: 'Mark and monitor monthly attendance records and percentages.',
}

export default function AttendancePage() {
  return <SmartCampusDashboard initialTab="Mark attendance" />
}
