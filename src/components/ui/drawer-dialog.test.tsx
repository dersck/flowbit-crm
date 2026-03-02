import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import {
  DrawerDialog,
  DrawerDialogBody,
  DrawerDialogContent,
  DrawerDialogDescription,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from '@/components/ui/drawer-dialog'

function DrawerHarness() {
  return (
    <DrawerDialog>
      <DrawerDialogTrigger asChild>
        <button type="button">Abrir filtros</button>
      </DrawerDialogTrigger>
      <DrawerDialogContent>
        <DrawerDialogHeader>
          <DrawerDialogTitle>Filtros</DrawerDialogTitle>
          <DrawerDialogDescription>
            Refina la vista del pipeline.
          </DrawerDialogDescription>
        </DrawerDialogHeader>
        <DrawerDialogBody>
          <label htmlFor="budget-min" className="block text-sm font-bold text-slate-900">
            Presupuesto minimo
          </label>
          <input id="budget-min" type="number" className="mt-2 rounded border px-3 py-2" />
        </DrawerDialogBody>
      </DrawerDialogContent>
    </DrawerDialog>
  )
}

describe('DrawerDialog', () => {
  it('opens with accessible dialog semantics', async () => {
    const user = userEvent.setup()
    render(<DrawerHarness />)

    await user.click(screen.getByRole('button', { name: 'Abrir filtros' }))
    const dialog = await screen.findByRole('dialog', { name: 'Filtros' })

    const results = await axe(dialog)
    expect(results.violations).toHaveLength(0)
  })

  it('returns focus to the trigger after Escape closes the drawer', async () => {
    const user = userEvent.setup()
    render(<DrawerHarness />)

    const trigger = screen.getByRole('button', { name: 'Abrir filtros' })

    await user.click(trigger)
    await screen.findByRole('dialog', { name: 'Filtros' })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Filtros' })).not.toBeInTheDocument()
    })

    expect(trigger).toHaveFocus()
  })
})
