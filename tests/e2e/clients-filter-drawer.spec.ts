import { expect, test } from '@playwright/test'

test('client testing route preserves list semantics and returns focus after closing the filter drawer', async ({ page }) => {
  await page.goto('/__testing__/clients', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1, name: 'Clientes' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: /buscar por nombre, empresa, email o telefono/i })).toBeVisible()
  await expect(page.locator('section[aria-labelledby="testing-clients-results-heading"] > ul > li')).toHaveCount(3)

  const filterTrigger = page.getByRole('button', { name: /filtros avanzados/i })
  await filterTrigger.focus()
  await expect(filterTrigger).toBeFocused()

  await page.keyboard.press('Enter')

  const dialog = page.getByRole('dialog', { name: 'Filtros Avanzados' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator(':focus')).toHaveCount(1)

  await page.keyboard.press('Escape')

  await expect(dialog).toBeHidden()
  await expect(filterTrigger).toBeFocused()
})
