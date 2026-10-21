import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Reports & Audits | Smart Campus',
  description: 'Accreditation, attendance metrics, and departmental audits.',
}

export default function ReportsPage() {
  return <SmartCampusDashboard initialTab="Reports" />
}
