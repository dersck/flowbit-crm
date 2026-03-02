import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { FieldGroup } from '@/components/ui/form-field'

describe('FieldGroup', () => {
  it('associates labels, hints, and errors with the control', async () => {
    const { container } = render(
      <FieldGroup
        label="Correo"
        hint="Usaremos este correo para compartir actualizaciones."
        error="El correo es obligatorio."
        required
      >
        <input type="email" />
      </FieldGroup>
    )

    const input = screen.getByRole('textbox', { name: /correo/i })
    const hint = screen.getByText('Usaremos este correo para compartir actualizaciones.')
    const error = screen.getByText('El correo es obligatorio.')
    const describedBy = input.getAttribute('aria-describedby') ?? ''

    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(describedBy).toContain(hint.id)
    expect(describedBy).toContain(error.id)

    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })

  it('renders option groups as a fieldset with a legend', async () => {
    const { container } = render(
      <FieldGroup label="Etapa del cliente" asFieldset>
        <div className="flex gap-2">
          <button type="button">Nuevo</button>
          <button type="button">Contactado</button>
        </div>
      </FieldGroup>
    )

    expect(screen.getByText('Etapa del cliente')).toHaveProperty('tagName', 'LEGEND')

    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })
})
