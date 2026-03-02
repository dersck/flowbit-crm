import { expect, test } from '@playwright/test'

test('dashboard testing route opens and closes the invite dialog by keyboard', async ({ page }) => {
  await page.goto('/__testing__/dashboard', { waitUntil: 'domcontentloaded' })

  const inviteTrigger = page.getByRole('button', { name: 'Invitar miembro' })

  await expect(page.getByRole('heading', { level: 1, name: 'Panel de Control' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Prioridades de Hoy' })).toBeVisible()

  await inviteTrigger.focus()
  await expect(inviteTrigger).toBeFocused()

  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Invitar Miembro' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Correo Electronico' })).toBeVisible()

  await page.keyboard.press('Escape')

  await expect(dialog).toBeHidden()
  await expect(inviteTrigger).toBeFocused()
})
