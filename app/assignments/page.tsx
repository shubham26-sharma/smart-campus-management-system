import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Coursework & Assignments | Smart Campus',
  description: 'Submit, review, and evaluate academic assignments.',
}

export default function AssignmentsPage() {
  return <SmartCampusDashboard initialTab="Assignments" />
}
