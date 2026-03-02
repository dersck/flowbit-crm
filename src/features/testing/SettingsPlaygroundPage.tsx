import SettingsPage from '@/features/settings/SettingsPage'
import { TestingAppProviders } from '@/features/testing/TestingAppProviders'

export default function SettingsPlaygroundPage() {
  return (
    <TestingAppProviders>
      <main className="min-h-screen bg-slate-50 p-5 sm:p-6 lg:p-8">
        <SettingsPage />
      </main>
    </TestingAppProviders>
  )
}
