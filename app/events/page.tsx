import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Campus Events | Smart Campus',
  description: 'Collegiate hackathons, cultural festivals, and technical symposiums.',
}

export default function EventsPage() {
  return <SmartCampusDashboard initialTab="Campus events" />
}
