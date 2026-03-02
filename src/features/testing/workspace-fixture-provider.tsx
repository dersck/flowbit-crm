/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, type ReactNode } from 'react'
import type { Activity, Client, Project, Task } from '@/types'

export type WorkspaceFixtureCollection = 'clients' | 'projects' | 'tasks' | 'activities'

type WorkspaceFixtureQueries = Partial<{
  clients: Client[]
  projects: Project[]
  tasks: Task[]
  activities: Activity[]
}>

interface FixtureMutationHandlers {
  create?: (data: Record<string, unknown>) => Promise<unknown>
  update?: (payload: { id: string; data: Record<string, unknown> }) => Promise<unknown>
  remove?: (id: string) => Promise<unknown>
}

interface WorkspaceFixtureContextValue {
  queries: WorkspaceFixtureQueries
  mutations?: Partial<Record<WorkspaceFixtureCollection, FixtureMutationHandlers>>
}

const WorkspaceFixtureContext = createContext<WorkspaceFixtureContextValue | null>(null)

export function WorkspaceFixtureProvider({
  children,
  value,
}: {
  children: ReactNode
  value: WorkspaceFixtureContextValue
}) {
  return (
    <WorkspaceFixtureContext.Provider value={value}>
      {children}
    </WorkspaceFixtureContext.Provider>
  )
}

export function useWorkspaceFixtureContext() {
  return useContext(WorkspaceFixtureContext)
}
