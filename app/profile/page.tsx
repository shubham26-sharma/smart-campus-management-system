import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Profile & Settings | Smart Campus',
  description: 'Manage account credentials and personal preferences.',
}

export default function ProfilePage() {
  return <SmartCampusDashboard initialTab="Profile" />
}
