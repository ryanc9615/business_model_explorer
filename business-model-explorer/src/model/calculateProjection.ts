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

    const finalMonth = months[months.length - 1];

    const yearOneRevenue = months.reduce(
        (total, month) => total + month.revenue,
        0
    );

    const yearOneGrossProfit = months.reduce(
        (total, month) => total + month.grossProfit,
        0
    )

    const yearOneEbitda = months.reduce(
        (total, month) => total + month.ebitda,
        0
    );

    const cashOutMonth = months.find(
        month => month.endingCash <=0
    );

    let runwayMonths: number | null = null;

    if(assumptions.startingCash <=0) {
        runwayMonths = 0;
    } else if (cashOutMonth) {
        const monthlyBurn = -cashOutMonth.ebitda;

        if (monthlyBurn > 0) {
            runwayMonths =
                (cashOutMonth.month - 1) +
                cashOutMonth.beginningCash / monthlyBurn;
        }
    };

    const summary = {
        exitCustomers: finalMonth.endingCustomers,
        exitARR: finalMonth.arr,
        yearOneRevenue,
        yearOneGrossProfit,
        yearOneEbitda,
        endingCash: finalMonth.endingCash,
        runwayMonths,
    };

    return {
        months,
        summary,
    };
}

export default calculateProjection;