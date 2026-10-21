import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Student Directory | Smart Campus',
  description: 'Manage and review student rosters, records, and enrollment.',
}

export default function StudentsPage() {
  return <SmartCampusDashboard initialTab="Students" />
}
