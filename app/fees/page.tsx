import { SmartCampusDashboard } from '@/components/smart-campus-dashboard'

export const metadata = {
  title: 'Fee Records & Statements | Smart Campus',
  description: 'View semester tuition statements, payment records, and receipts.',
}

export default function FeesPage() {
  return <SmartCampusDashboard initialTab="Fee records" />
}
