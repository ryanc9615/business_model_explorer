import type { CompanyAssumptions } from "../types/company";

export const baselineCompany: CompanyAssumptions = {
    startingCustomers: 120,
    startingCash: 1_200_000,
    monthlyPrice: 1_500,
    monthlyChurnRate: 0.015,
    paymentTermsDays: 30,

    acquisition: {
        salesReps: 4,
        opportunitiesPerRepPerMonth: 4,
        winRate: 0.10,
        marketingSpendPerMonth: 30_000,
        marketingCostPerOpportunity: 1_500,
    },

    costs: {
        salesRepMonthlyCost: 9_000,
        otherHeadcount: 15,
        otherEmployeeMonthlyCost: 7_000,
        otherFixedOpexPerMonth: 25_000,
        grossMargin: 0.82,
    },
};