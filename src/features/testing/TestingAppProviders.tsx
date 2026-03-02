import type { ReactNode } from 'react'
import { AuthContext, type AuthContextType } from '@/features/auth/AuthContext'
import { WorkspaceFixtureProvider, type WorkspaceFixtureCollection } from '@/features/testing/workspace-fixture-provider'
import { createTestUser } from '@/test/fixtures/workspace'
import type { Activity, Client, Project, Task, User } from '@/types'

interface TestingAppProvidersProps {
  children: ReactNode
  appUser?: User
  queries?: Partial<{
    clients: Client[]
    projects: Project[]
    tasks: Task[]
    activities: Activity[]
  }>
  mutations?: Partial<Record<WorkspaceFixtureCollection, {
    create?: (data: Record<string, unknown>) => Promise<unknown>
    update?: (payload: { id: string; data: Record<string, unknown> }) => Promise<unknown>
    remove?: (id: string) => Promise<unknown>
  }>>
}

export function TestingAppProviders({
  children,
  appUser = createTestUser(),
  queries = {},
  mutations,
}: TestingAppProvidersProps) {
  const authValue: AuthContextType = {
    user: null,
    appUser,
    loading: false,
    refreshAppUser: async () => { },
  }

  return (
    <AuthContext.Provider value={authValue}>
      <WorkspaceFixtureProvider value={{ queries, mutations }}>
        {children}
      </WorkspaceFixtureProvider>
    </AuthContext.Provider>
  )
}
