import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Complaints & Helpdesk | Smart Campus',
  description: 'Submit and track service tickets and campus helpdesk grievances.',
}

export default function ComplaintsPage() {
  return <SmartCampusDashboard initialTab="Complaints" />
}
