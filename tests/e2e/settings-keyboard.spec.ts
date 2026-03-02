import { expect, test } from '@playwright/test'

test('settings testing route supports keyboard navigation across tabs', async ({ page }) => {
  await page.goto('/__testing__/settings', { waitUntil: 'domcontentloaded' })

  const profileTab = page.getByRole('tab', { name: 'Mi Perfil' })
  const workspaceTab = page.getByRole('tab', { name: 'Workspace' })
  const notificationsTab = page.getByRole('tab', { name: 'Notificaciones' })

  await expect(page.getByRole('heading', { level: 1, name: 'Configuracion' })).toBeVisible()
  await expect(page.getByRole('tabpanel', { name: 'Mi Perfil' })).toBeVisible()

  await profileTab.focus()
  await expect(profileTab).toBeFocused()

  await page.keyboard.press('ArrowDown')
  await expect(workspaceTab).toBeFocused()
  await expect(workspaceTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'Workspace' })).toBeVisible()

  await page.keyboard.press('End')
  await expect(notificationsTab).toBeFocused()
  await expect(notificationsTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'Notificaciones' })).toBeVisible()

  await page.keyboard.press('Home')
  await expect(profileTab).toBeFocused()
  await expect(profileTab).toHaveAttribute('aria-selected', 'true')
})
