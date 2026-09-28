import { describe, expect, it } from 'vitest'
import { baselineCompany } from '../data/baselineCompany'
import type { CompanyAssumptions } from '../types/company'
import { calculateProjection } from './calculateProjection'

type AssumptionOverrides =
  Partial<Omit<CompanyAssumptions, 'acquisition' | 'costs'>> & {
    acquisition?: Partial<CompanyAssumptions['acquisition']>
    costs?: Partial<CompanyAssumptions['costs']>
  }

function makeAssumptions(
  overrides: AssumptionOverrides = {},
): CompanyAssumptions {
  return {
    ...baselineCompany,
    ...overrides,
    acquisition: {
      ...baselineCompany.acquisition,
      ...overrides.acquisition,
    },
    costs: {
      ...baselineCompany.costs,
      ...overrides.costs,
    },
  }
}

describe('calculateProjection', () => {
  it('calculates customer churn', () => {
    const assumptions = makeAssumptions({
      startingCustomers: 100,
      monthlyChurnRate: 0.02,
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 0,
      },
    })

    const month1 = calculateProjection(assumptions).months[0]

    expect(month1.churnedCustomers).toBe(2)
    expect(month1.endingCustomers).toBe(98)
  })

  it('does not churn customers when churn is zero', () => {
    const assumptions = makeAssumptions({
      startingCustomers: 100,
      monthlyChurnRate: 0,
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 0,
      },
    })

    const month1 = calculateProjection(assumptions).months[0]

    expect(month1.churnedCustomers).toBe(0)
    expect(month1.endingCustomers).toBe(100)
  })

  it('calculates sales opportunities from rep capacity', () => {
    const assumptions = makeAssumptions({
      acquisition: {
        salesReps: 4,
        opportunitiesPerRepPerMonth: 4,
        marketingSpendPerMonth: 0,
      },
    })

    const month1 = calculateProjection(assumptions).months[0]

    expect(month1.salesOpportunities).toBe(16)
  })

  it('generates zero sales opportunities with zero sales reps', () => {
    const assumptions = makeAssumptions({
      acquisition: {
        salesReps: 0,
        opportunitiesPerRepPerMonth: 4,
      },
    })

    const month1 = calculateProjection(assumptions).months[0]

    expect(month1.salesOpportunities).toBe(0)
  })

  it('calculates marketing opportunities from marketing spend', () => {
    const assumptions = makeAssumptions({
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 30_000,
        marketingCostPerOpportunity: 1_500,
      },
    })

    const month1 = calculateProjection(assumptions).months[0]

    expect(month1.marketingOpportunities).toBe(20)
  })

  it('increases revenue when price increases', () => {
    const lowPrice = makeAssumptions({
      startingCustomers: 100,
      monthlyPrice: 1_500,
      monthlyChurnRate: 0,
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 0,
      },
    })

    const highPrice = makeAssumptions({
      startingCustomers: 100,
      monthlyPrice: 3_000,
      monthlyChurnRate: 0,
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 0,
      },
    })

    const lower = calculateProjection(lowPrice).months[0]
    const higher = calculateProjection(highPrice).months[0]

    expect(higher.mrr).toBe(lower.mrr * 2)
    expect(higher.revenue).toBe(lower.revenue * 2)
  })

  it('generates more opportunities when marketing spend increases', () => {
    const lowerSpend = makeAssumptions({
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 30_000,
        marketingCostPerOpportunity: 1_500,
        winRate: 0.10,
      },
    })

    const higherSpend = makeAssumptions({
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 60_000,
        marketingCostPerOpportunity: 1_500,
        winRate: 0.10,
      },
    })

    const lower = calculateProjection(lowerSpend).months[0]
    const higher = calculateProjection(higherSpend).months[0]

    expect(lower.marketingOpportunities).toBe(20)
    expect(higher.marketingOpportunities).toBe(40)
    expect(higher.newCustomers).toBeGreaterThan(lower.newCustomers)
  })

  it('increases gross profit when gross margin increases', () => {
    const lowerMargin = makeAssumptions({
      startingCustomers: 100,
      monthlyPrice: 1_500,
      monthlyChurnRate: 0,
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 0,
      },
      costs: {
        grossMargin: 0.50,
      },
    })

    const higherMargin = makeAssumptions({
      startingCustomers: 100,
      monthlyPrice: 1_500,
      monthlyChurnRate: 0,
      acquisition: {
        salesReps: 0,
        marketingSpendPerMonth: 0,
      },
      costs: {
        grossMargin: 0.80,
      },
    })

    const lower = calculateProjection(lowerMargin).months[0]
    const higher = calculateProjection(higherMargin).months[0]

    expect(higher.revenue).toBe(lower.revenue)
    expect(lower.grossProfit).toBe(75_000)
    expect(higher.grossProfit).toBe(120_000)
    expect(higher.ebitda).toBeGreaterThan(lower.ebitda)
  })

  it('carries cash forward through the projection', () => {
    const months = calculateProjection(baselineCompany).months

    expect(months[0].beginningCash).toBe(
      baselineCompany.startingCash,
    )

    for (let i = 0; i < months.length; i++) {
      expect(months[i].endingCash).toBeCloseTo(
        months[i].beginningCash + months[i].ebitda,
      )

      if (i > 0) {
        expect(months[i].beginningCash).toBeCloseTo(
          months[i - 1].endingCash,
        )
      }
    }
  })
})