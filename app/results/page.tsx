import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Grade Reports & Results | Smart Campus',
  description: 'Official student semester transcripts and grade cards.',
}

export default function ResultsPage() {
  return <SmartCampusDashboard initialTab="Results" />
}
