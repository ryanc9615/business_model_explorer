import type { CompanyAssumptions } from "../types/company";

export interface MonthlyProjection {
    month: number;

    beginningCustomers: number;
    salesOpportunities: number;
    marketingOpportunities: number;
    totalOpportunities: number;
    newCustomers: number;
    churnedCustomers: number;
    endingCustomers: number;

    mrr: number;
    arr: number;
    revenue: number;

    grossProfit: number;
    salesPayroll: number;
    otherPayroll: number;
    operatingCosts: number;
    ebitda: number;

    beginningCash: number;
    endingCash: number;
}



export function calculateProjection(
    assumptions: CompanyAssumptions
) {
    let beginningCustomers = assumptions.startingCustomers;
    let beginningCash = assumptions.startingCash;
    
    const months: MonthlyProjection[] = [];

    for (let month = 1; month <= 12; month++) {

        // Acquisitions
        const salesOpportunities = 
            assumptions.acquisition.salesReps *
            assumptions.acquisition.opportunitiesPerRepPerMonth;
        
        const marketingOpportunities =
            assumptions.acquisition.marketingSpendPerMonth /
            assumptions.acquisition.marketingCostPerOpportunity;
        
        const totalOpportunities = 
            salesOpportunities + marketingOpportunities;

        const newCustomers =
            totalOpportunities *
            assumptions.acquisition.winRate;

        // Customers
        const churnedCustomers =
            beginningCustomers *
            assumptions.monthlyChurnRate;
        
        const endingCustomers =
            beginningCustomers +
            newCustomers -
            churnedCustomers;

        // Revenue
        const mrr =
            endingCustomers *
            assumptions.monthlyPrice;
        
        const arr = mrr * 12;

        const revenue = mrr;

        // Profit
        const grossProfit = 
            revenue *
            assumptions.costs.grossMargin;

        // OPEX
        const salesPayroll =
            assumptions.acquisition.salesReps *
            assumptions.costs.salesRepMonthlyCost;
        
        const otherPayroll =
            assumptions.costs.otherHeadcount *
            assumptions.costs.otherEmployeeMonthlyCost;

        const operatingCosts =
            salesPayroll +
            otherPayroll +
            assumptions.acquisition.marketingSpendPerMonth +
            assumptions.costs.otherFixedOpexPerMonth;
        
        //EBITDA
        const ebitda =
            grossProfit - 
            operatingCosts;

        // Cash
        const endingCash =
            beginningCash +
            ebitda;

        const monthResult: MonthlyProjection = {
            month,

            beginningCustomers,
            salesOpportunities,
            marketingOpportunities,
            totalOpportunities,
            newCustomers,
            churnedCustomers,
            endingCustomers,

            mrr,
            arr,
            revenue,

            grossProfit,
            salesPayroll,
            otherPayroll,
            operatingCosts,
            ebitda,

            beginningCash,
            endingCash,
        };

        months.push(monthResult);
        
        beginningCustomers = endingCustomers;
        beginningCash = endingCash;
    }

    return {
        months,
    };
}

export default calculateProjection;