import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CausalExplorer } from './CausalExplorer'

describe('CausalExplorer', () => {
  it('lets the user drill into a causal relationship', async () => {
    const user = userEvent.setup()

    render(<CausalExplorer />)

    await user.click(
      screen.getByRole('button', {
        name: /ebitda/i,
      }),
    )

    await user.click(
      screen.getByRole('button', {
        name: /operating costs/i,
      }),
    )

    expect(
      screen.getByText(
        'Payroll + Marketing spend + Other operating costs',
      ),
    ).toBeVisible()

    expect(
      screen.getByRole('navigation', {
        name: /causal explorer navigation/i,
      }),
    ).toHaveTextContent('Operating costs')
  })
})