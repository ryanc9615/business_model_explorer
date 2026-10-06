import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('restores the baseline scenario when reset is clicked', async () => {
    const user = userEvent.setup()

    render(<App />)

    const priceSlider = screen.getByRole('slider', {
      name: /monthly price/i,
    })

    fireEvent.change(priceSlider, {
      target: { value: '2000' },
    })

    expect(screen.getByText('£2,000')).toBeVisible()

    await user.click(
      screen.getByRole('button', {
        name: /reset scenario/i,
      }),
    )

    expect(screen.getByText('£1,500')).toBeVisible()
    expect(screen.queryByText('£2,000')).not.toBeInTheDocument()
  })
})