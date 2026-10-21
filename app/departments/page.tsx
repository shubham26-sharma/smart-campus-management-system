import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Departments & Academics | Smart Campus',
  description: 'Manage college departments, classes, and course curricula.',
}

export default function DepartmentsPage() {
  return <SmartCampusDashboard initialTab="Departments" />
}
