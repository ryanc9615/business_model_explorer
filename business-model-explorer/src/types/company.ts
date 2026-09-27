export interface AcquisitionAssumptions {
    salesReps: number;
    opportunitiesPerRepPerMonth: number;
    winRate: number;
    marketingSpendPerMonth: number;
    marketingCostPerOpportunity: number;
}

export interface CostAssumptions {
    salesRepMonthlyCost: number;
    otherHeadcount: number;
    otherEmployeeMonthlyCost: number;
    otherFixedOpexPerMonth: number;
    grossMargin: number;
}

export interface CompanyAssumptions {
    startingCustomers: number;
    startingCash: number;
    monthlyPrice: number;
    monthlyChurnRate: number;
    paymentTermsDays: number;

    acquisition: AcquisitionAssumptions;
    costs: CostAssumptions;
}

