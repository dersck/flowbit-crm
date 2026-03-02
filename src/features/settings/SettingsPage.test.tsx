import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => ({
    appUser: {
      displayName: 'Ada Lovelace',
      email: 'ada@flowbit.test',
    },
  }),
}))

import SettingsPage from '@/features/settings/SettingsPage'

describe('SettingsPage', () => {
  it('renders accessible tabs and panels', async () => {
    const { container } = render(<SettingsPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Configuracion' })).toBeVisible()
    expect(screen.getByRole('tab', { name: 'Mi Perfil' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Mi Perfil' })).toBeVisible()

    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })

  it('supports arrow, home, and end keyboard navigation across tabs', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />)

    const profileTab = screen.getByRole('tab', { name: 'Mi Perfil' })
    const workspaceTab = screen.getByRole('tab', { name: 'Workspace' })
    const notificationsTab = screen.getByRole('tab', { name: 'Notificaciones' })

    profileTab.focus()
    await user.keyboard('{ArrowDown}')

    expect(workspaceTab).toHaveFocus()
    expect(workspaceTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Workspace' })).toBeVisible()

    await user.keyboard('{End}')

    expect(notificationsTab).toHaveFocus()
    expect(notificationsTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Notificaciones' })).toBeVisible()

    await user.keyboard('{Home}')

    expect(profileTab).toHaveFocus()
    expect(profileTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Mi Perfil' })).toBeVisible()
  })
})
