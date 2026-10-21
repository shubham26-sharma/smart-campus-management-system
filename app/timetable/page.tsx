import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Master Timetable | Smart Campus',
  description: 'Weekly lecture, laboratory, and room allocation schedules.',
}

export default function TimetablePage() {
  return <SmartCampusDashboard initialTab="Timetable" />
}
