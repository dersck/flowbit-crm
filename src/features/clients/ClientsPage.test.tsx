import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { createTestClients } from '@/test/fixtures/workspace'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/hooks/useFirestore', () => ({
  useWorkspaceQuery: vi.fn(() => ({
    data: createTestClients(),
    isLoading: false,
  })),
  useWorkspaceMutation: vi.fn(() => ({
    createMutation: { mutateAsync: vi.fn() },
    updateMutation: { mutateAsync: vi.fn() },
    deleteMutation: { mutateAsync: vi.fn(), isPending: false },
  })),
}))

import ClientsPage from '@/features/clients/ClientsPage'

describe('ClientsPage', () => {
  it('renders client results with accessible search and list semantics', async () => {
    const { container } = render(
      <MemoryRouter>
        <ClientsPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Clientes' })).toBeVisible()
    expect(screen.getByRole('textbox', { name: /buscar por nombre, empresa, email o telefono/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /filtros avanzados/i })).toBeVisible()
    expect(screen.getAllByRole('article')).toHaveLength(createTestClients().length)

    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  }, 30000)
})
