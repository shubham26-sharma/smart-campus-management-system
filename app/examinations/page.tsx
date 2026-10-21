import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Examinations | Smart Campus',
  description: 'Mid-term and end-term exam datesheets and seating arrangements.',
}

export default function ExaminationsPage() {
  return <SmartCampusDashboard initialTab="Examinations" />
}
