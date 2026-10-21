import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Faculty Directory | Smart Campus',
  description: 'Academic staff profiles, workloads, and department allocations.',
}

export default function FacultyPage() {
  return <SmartCampusDashboard initialTab="Faculty" />
}
