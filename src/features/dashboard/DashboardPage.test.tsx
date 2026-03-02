import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  createTestActivities,
  createTestClients,
  createTestProjects,
  createTestTasks,
} from '@/test/fixtures/workspace'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    promise: vi.fn(),
  },
}))

vi.mock('recharts', () => {
  const passthrough = ({ children }: { children?: ReactNode }) => <div>{children}</div>

  return {
    ResponsiveContainer: passthrough,
    AreaChart: () => <div />,
    BarChart: () => <div />,
    Area: () => <div />,
    Bar: () => <div />,
    CartesianGrid: () => <div />,
    Cell: () => <div />,
    Tooltip: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
  }
})

vi.mock('@/hooks/useFirestore', () => ({
  useWorkspaceQuery: vi.fn((collectionName: string) => {
    if (collectionName === 'tasks') {
      return { data: createTestTasks(), isLoading: false }
    }

    if (collectionName === 'projects') {
      return { data: createTestProjects(), isLoading: false }
    }

    if (collectionName === 'clients') {
      return { data: createTestClients(), isLoading: false }
    }

    if (collectionName === 'activities') {
      return { data: createTestActivities(), isLoading: false }
    }

    return { data: [], isLoading: false }
  }),
  useWorkspaceMutation: vi.fn(() => ({
    createMutation: { mutateAsync: vi.fn() },
    updateMutation: { mutateAsync: vi.fn() },
    deleteMutation: { mutateAsync: vi.fn(), isPending: false },
  })),
}))

import DashboardPage from '@/features/dashboard/DashboardPage'

describe('DashboardPage', () => {
  it('renders dashboard landmarks, sections, and priority lists without accessibility violations', async () => {
    const { container } = render(<DashboardPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Panel de Control' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 2, name: 'Prioridades de Hoy' })).toBeVisible()
    expect(screen.getAllByRole('list').length).toBeGreaterThan(1)

    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })
})
