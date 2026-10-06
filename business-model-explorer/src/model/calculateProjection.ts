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


// Phase 14 — defensive input helpers

function finiteOrZero(value: unknown): number {
    return typeof value === "number" && Number.isFinite(value)
        ? value
        : 0;
}

function nonNegative(value: unknown): number {
    return Math.max(0, finiteOrZero(value));
}

function rate(value: unknown): number {
    return Math.min(1, nonNegative(value));
}

function safeDivide(
    numerator: number,
    denominator: number
): number {
    if (
        !Number.isFinite(numerator) ||
        !Number.isFinite(denominator) ||
        denominator <= 0
    ) {
        return 0;
    }

    return numerator / denominator;
}


// Phase 14 — normalise assumptions before calculation

function normaliseAssumptions(
    assumptions: CompanyAssumptions | null | undefined
): CompanyAssumptions {
    return {
        startingCustomers: nonNegative(
            assumptions?.startingCustomers
        ),

        startingCash: nonNegative(
            assumptions?.startingCash
        ),

        monthlyPrice: nonNegative(
            assumptions?.monthlyPrice
        ),

        monthlyChurnRate: rate(
            assumptions?.monthlyChurnRate
        ),

        paymentTermsDays: nonNegative(
            assumptions?.paymentTermsDays
        ),

        acquisition: {
            salesReps: nonNegative(
                assumptions?.acquisition?.salesReps
            ),

            opportunitiesPerRepPerMonth: nonNegative(
                assumptions?.acquisition
                    ?.opportunitiesPerRepPerMonth
            ),

            winRate: rate(
                assumptions?.acquisition?.winRate
            ),

            marketingSpendPerMonth: nonNegative(
                assumptions?.acquisition
                    ?.marketingSpendPerMonth
            ),

            marketingCostPerOpportunity: nonNegative(
                assumptions?.acquisition
                    ?.marketingCostPerOpportunity
            ),
        },

        costs: {
            salesRepMonthlyCost: nonNegative(
                assumptions?.costs?.salesRepMonthlyCost
            ),

            otherHeadcount: nonNegative(
                assumptions?.costs?.otherHeadcount
            ),

            otherEmployeeMonthlyCost: nonNegative(
                assumptions?.costs
                    ?.otherEmployeeMonthlyCost
            ),

            otherFixedOpexPerMonth: nonNegative(
                assumptions?.costs
                    ?.otherFixedOpexPerMonth
            ),

            grossMargin: rate(
                assumptions?.costs?.grossMargin
            ),
        },
    };
}


export function calculateProjection(
    assumptions: CompanyAssumptions
) {
    const safeAssumptions =
        normaliseAssumptions(assumptions);

    let beginningCustomers =
        safeAssumptions.startingCustomers;

    let beginningCash =
        safeAssumptions.startingCash;

    const months: MonthlyProjection[] = [];

    for (let month = 1; month <= 12; month++) {

        // Acquisitions
        const salesOpportunities =
            safeAssumptions.acquisition.salesReps *
            safeAssumptions.acquisition
                .opportunitiesPerRepPerMonth;

        const marketingOpportunities =
            safeDivide(
                safeAssumptions.acquisition
                    .marketingSpendPerMonth,
                safeAssumptions.acquisition
                    .marketingCostPerOpportunity
            );

        const totalOpportunities =
            salesOpportunities +
            marketingOpportunities;

        const newCustomers =
            totalOpportunities *
            safeAssumptions.acquisition.winRate;


        // Customers
        const churnedCustomers =
            beginningCustomers *
            safeAssumptions.monthlyChurnRate;

        const endingCustomers =
            Math.max(
                0,
                beginningCustomers +
                newCustomers -
                churnedCustomers
            );


        // Revenue
        const mrr =
            endingCustomers *
            safeAssumptions.monthlyPrice;

        const arr = mrr * 12;

        const revenue = mrr;


        // Profit
        const grossProfit =
            revenue *
            safeAssumptions.costs.grossMargin;


        // OPEX
        const salesPayroll =
            safeAssumptions.acquisition.salesReps *
            safeAssumptions.costs.salesRepMonthlyCost;

        const otherPayroll =
            safeAssumptions.costs.otherHeadcount *
            safeAssumptions.costs
                .otherEmployeeMonthlyCost;

        const operatingCosts =
            salesPayroll +
            otherPayroll +
            safeAssumptions.acquisition
                .marketingSpendPerMonth +
            safeAssumptions.costs
                .otherFixedOpexPerMonth;


        // EBITDA
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


    const finalMonth =
        months[months.length - 1];


    const yearOneRevenue = months.reduce(
        (total, month) =>
            total + month.revenue,
        0
    );

    const yearOneGrossProfit = months.reduce(
        (total, month) =>
            total + month.grossProfit,
        0
    );

    const yearOneEbitda = months.reduce(
        (total, month) =>
            total + month.ebitda,
        0
    );


    // Runway
    const cashOutMonth = months.find(
        month => month.endingCash <= 0
    );

    let runwayMonths: number | null = null;

    if (safeAssumptions.startingCash <= 0) {
        runwayMonths = 0;
    } else if (cashOutMonth) {
        const monthlyBurn =
            -cashOutMonth.ebitda;

        if (monthlyBurn > 0) {
            runwayMonths =
                (cashOutMonth.month - 1) +
                safeDivide(
                    cashOutMonth.beginningCash,
                    monthlyBurn
                );
        }
    }


    // Final runway protection
    if (
        runwayMonths !== null &&
        (
            !Number.isFinite(runwayMonths) ||
            runwayMonths < 0
        )
    ) {
        runwayMonths = 0;
    }


    const summary = {
        exitCustomers:
            finalMonth.endingCustomers,

        exitARR:
            finalMonth.arr,

        yearOneRevenue,
        yearOneGrossProfit,
        yearOneEbitda,

        endingCash:
            finalMonth.endingCash,

        runwayMonths,
    };


    return {
        months,
        summary,
    };
}

export default calculateProjection;