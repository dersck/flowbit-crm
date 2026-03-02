import DashboardPage from '@/features/dashboard/DashboardPage'
import { TestingAppProviders } from '@/features/testing/TestingAppProviders'
import {
  createTestActivities,
  createTestClients,
  createTestProjects,
  createTestTasks,
} from '@/test/fixtures/workspace'

export default function DashboardPlaygroundPage() {
  return (
    <TestingAppProviders
      queries={{
        activities: createTestActivities(),
        clients: createTestClients(),
        projects: createTestProjects(),
        tasks: createTestTasks(),
      }}
    >
      <main className="min-h-screen bg-slate-50 p-5 sm:p-6 lg:p-8">
        <DashboardPage />
      </main>
    </TestingAppProviders>
  )
}
