import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Official Circulars & Notices | Smart Campus',
  description: 'Campus-wide announcements, exam circulars, and notifications.',
}

export default function NoticesPage() {
  return <SmartCampusDashboard initialTab="Notices" />
}
