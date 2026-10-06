import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DriverControl from './DriverControl'

function ControlledDriver() {
  const [value, setValue] = useState(1500)

  return (
    <DriverControl
      label="Monthly price"
      value={value}
      min={500}
      max={3000}
      step={100}
      formatValue={(value) => `£${value.toLocaleString()}`}
      onChange={setValue}
    />
  )
}

describe('DriverControl', () => {
  it('displays its current value', () => {
    render(<ControlledDriver />)

    expect(
      screen.getByRole('slider', { name: /monthly price/i }),
    ).toBeInTheDocument()

    expect(screen.getByText('£1,500')).toBeVisible()
  })

  it('updates the displayed value when the slider changes', () => {
    render(<ControlledDriver />)

    const slider = screen.getByRole('slider', {
      name: /monthly price/i,
    })

    fireEvent.change(slider, {
      target: { value: '2000' },
    })

    expect(screen.getByText('£2,000')).toBeVisible()
  })
})