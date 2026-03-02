import { expect, test } from '@playwright/test'

test('login page exposes a single main landmark and keyboard-friendly auth form', async ({ page }) => {
  await page.goto('/auth/login', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1, name: 'Flowbit CRM' })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Contrasena')).toBeVisible()

  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Email')).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Contrasena')).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Google' })).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Registrate gratis' })).toBeFocused()
})
