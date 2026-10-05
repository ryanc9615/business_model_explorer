import type { CausalNodeDefinition } from "../types/causal";

/*
 * Shared customer roll-forward
 *
 * This mirrors calculateProjection():
 *
 * churnedCustomers =
 *   beginningCustomers * monthlyChurnRate
 *
 * endingCustomers =
 *   beginningCustomers
 *   + newCustomers
 *   - churnedCustomers
 */
const customerBridge: CausalNodeDefinition = {
  id: "ending-customers",
  label: "Ending customers",
  formula:
    "Beginning customers + New customers − Churned customers",
  kind: "calculation",

  children: [
    {
      id: "beginning-customers",
      label: "Beginning customers",
      explanation:
        "Customers carried forward from the previous month.",
      kind: "calculation",
    },

    /*
     * New customers
     *
     * calculateProjection():
     *
     * salesOpportunities =
     *   salesReps * opportunitiesPerRepPerMonth
     *
     * marketingOpportunities =
     *   marketingSpendPerMonth /
     *   marketingCostPerOpportunity
     *
     * newCustomers =
     *   (salesOpportunities + marketingOpportunities)
     *   * winRate
     */
    {
      id: "new-customers",
      label: "New customers",
      formula:
        "(Sales opportunities + Marketing opportunities) × Win rate",
      kind: "calculation",

      children: [
        {
          id: "sales-opportunities",
          label: "Sales opportunities",
          formula:
            "Sales reps × Opportunities per rep per month",
          kind: "calculation",

          children: [
            {
              id: "sales-reps",
              label: "Sales reps",
              kind: "driver",
            },
            {
              id: "opportunities-per-rep",
              label: "Opportunities per rep per month",
              kind: "driver",
            },
          ],
        },

        {
          id: "marketing-opportunities",
          label: "Marketing opportunities",
          formula:
            "Marketing spend per month ÷ Marketing cost per opportunity",
          kind: "calculation",

          children: [
            {
              id: "marketing-spend",
              label: "Marketing spend per month",
              kind: "driver",
            },
            {
              id: "marketing-cost-per-opportunity",
              label: "Marketing cost per opportunity",
              kind: "driver",
            },
          ],
        },

        {
          id: "win-rate",
          label: "Win rate",
          explanation:
            "The percentage of acquisition opportunities that convert into customers.",
          kind: "driver",
        },
      ],
    },

    {
      id: "churned-customers",
      label: "Churned customers",
      formula:
        "Beginning customers × Monthly churn rate",
      kind: "calculation",

      children: [
        {
          id: "churn-rate",
          label: "Monthly churn rate",
          kind: "driver",
        },
      ],
    },
  ],
};

/*
 * ARR
 *
 * MRR =
 *   endingCustomers * monthlyPrice
 *
 * ARR =
 *   MRR * 12
 */
const arrTree: CausalNodeDefinition = {
  id: "arr",
  label: "ARR",
  formula: "MRR × 12",
  explanation:
    "Annualised recurring revenue based on ending monthly recurring revenue.",
  kind: "outcome",

  children: [
    {
      id: "mrr",
      label: "MRR",
      formula:
        "Ending customers × Monthly price",
      kind: "calculation",

      children: [
        customerBridge,

        {
          id: "monthly-price",
          label: "Monthly price",
          kind: "driver",
        },
      ],
    },

    {
      id: "annualisation-factor",
      label: "12 months",
      explanation:
        "Converts monthly recurring revenue into an annualised amount.",
      kind: "constant",
    },
  ],
};

/*
 * Revenue
 *
 * In the current model:
 *
 * revenue = MRR
 *
 * MRR =
 *   endingCustomers * monthlyPrice
 */
const revenueNode: CausalNodeDefinition = {
  id: "revenue",
  label: "Revenue",
  formula:
    "Ending customers × Monthly price",
  kind: "calculation",

  children: [
    customerBridge,

    {
      id: "revenue-monthly-price",
      label: "Monthly price",
      kind: "driver",
    },
  ],
};

/*
 * Gross profit
 *
 * grossProfit =
 *   revenue * grossMargin
 */
const grossProfitNode: CausalNodeDefinition = {
  id: "gross-profit",
  label: "Gross profit",
  formula:
    "Revenue × Gross margin",
  kind: "calculation",

  children: [
    revenueNode,

    {
      id: "gross-margin",
      label: "Gross margin",
      kind: "driver",
    },
  ],
};

/*
 * Sales payroll
 *
 * salesPayroll =
 *   salesReps * salesRepMonthlyCost
 */
const salesPayrollNode: CausalNodeDefinition = {
  id: "sales-payroll",
  label: "Sales payroll",
  formula:
    "Sales reps × Monthly cost per sales rep",
  kind: "calculation",

  children: [
    {
      id: "payroll-sales-reps",
      label: "Sales reps",
      kind: "driver",
    },

    {
      id: "sales-rep-monthly-cost",
      label: "Monthly cost per sales rep",
      kind: "driver",
    },
  ],
};

/*
 * Other payroll
 *
 * otherPayroll =
 *   otherHeadcount * otherEmployeeMonthlyCost
 */
const otherPayrollNode: CausalNodeDefinition = {
  id: "other-payroll",
  label: "Other payroll",
  formula:
    "Other headcount × Monthly cost per employee",
  kind: "calculation",

  children: [
    {
      id: "other-headcount",
      label: "Other headcount",
      kind: "driver",
    },

    {
      id: "other-employee-monthly-cost",
      label: "Monthly cost per employee",
      kind: "driver",
    },
  ],
};

/*
 * Payroll
 *
 * Payroll isn't calculated as one generic
 * headcount × salary assumption.
 *
 * The model separately calculates:
 *
 * salesPayroll
 * +
 * otherPayroll
 */
const payrollNode: CausalNodeDefinition = {
  id: "payroll",
  label: "Payroll",
  formula:
    "Sales payroll + Other payroll",
  kind: "calculation",

  children: [
    salesPayrollNode,
    otherPayrollNode,
  ],
};

/*
 * Other fixed operating costs
 *
 * This corresponds directly to:
 *
 * costs.otherFixedOpexPerMonth
 *
 * It represents fixed operating expenditure
 * outside payroll and marketing.
 */
const otherOperatingCostsNode: CausalNodeDefinition = {
  id: "other-operating-costs",
  label: "Other operating costs",
  explanation:
    "Fixed operating costs outside payroll and marketing.",
  kind: "driver",
};

/*
 * Total operating costs
 *
 * calculateProjection():
 *
 * operatingCosts =
 *   salesPayroll
 *   + otherPayroll
 *   + marketingSpendPerMonth
 *   + otherFixedOpexPerMonth
 *
 * For the explorer we group the two payroll
 * calculations under Payroll while preserving
 * the same arithmetic:
 *
 * Operating costs =
 *   Payroll
 *   + Marketing spend
 *   + Other operating costs
 */
const operatingCostsNode: CausalNodeDefinition = {
  id: "operating-costs",
  label: "Operating costs",
  formula:
    "Payroll + Marketing spend + Other operating costs",
  kind: "calculation",

  children: [
    payrollNode,

    {
      id: "operating-marketing-spend",
      label: "Marketing spend",
      explanation:
        "Monthly marketing expenditure. It affects both operating costs and marketing opportunity generation.",
      kind: "driver",
    },

    otherOperatingCostsNode,
  ],
};

/*
 * EBITDA
 *
 * ebitda =
 *   grossProfit - operatingCosts
 */
const ebitdaTree: CausalNodeDefinition = {
  id: "ebitda",
  label: "EBITDA",
  formula:
    "Gross profit − Operating costs",
  kind: "outcome",

  children: [
    grossProfitNode,
    operatingCostsNode,
  ],
};

/*
 * Cash
 *
 * Current model:
 *
 * endingCash =
 *   beginningCash + EBITDA
 */
const cashTree: CausalNodeDefinition = {
  id: "cash",
  label: "Cash",
  formula:
    "Beginning cash + EBITDA",
  explanation:
    "In the current model, EBITDA flows directly into the change in cash.",
  kind: "outcome",

  children: [
    {
      id: "beginning-cash",
      label: "Beginning cash",
      explanation:
        "Cash carried forward from the previous month.",
      kind: "calculation",
    },

    ebitdaTree,
  ],
};

export const causalTrees: CausalNodeDefinition[] = [
  arrTree,
  ebitdaTree,
  cashTree,
];