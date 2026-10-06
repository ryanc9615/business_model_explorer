import DriverControl from "./DriverControl";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../utils/formatters";

type DriverPanelProps = {
  monthlyPricePerCustomer: number;
  monthlyChurnRate: number;
  salesReps: number;
  opportunitiesPerRepPerMonth: number;
  winRate: number;
  marketingSpendPerMonth: number;
  otherHeadcount: number;
  fixedOperatingCostsPerMonth: number;
  grossMargin: number;

  onMonthlyPriceChange: (value: number) => void;
  onMonthlyChurnRateChange: (value: number) => void;
  onSalesRepsChange: (value: number) => void;
  onSalesProductivityChange: (value: number) => void;
  onWinRateChange: (value: number) => void;
  onMarketingSpendChange: (value: number) => void;
  onOtherHeadcountChange: (value: number) => void;
  onFixedOperatingCostsChange: (value: number) => void;
  onGrossMarginChange: (value: number) => void;
};

function DriverPanel({
  monthlyPricePerCustomer,
  monthlyChurnRate,
  salesReps,
  opportunitiesPerRepPerMonth,
  winRate,
  marketingSpendPerMonth,
  otherHeadcount,
  fixedOperatingCostsPerMonth,
  grossMargin,
  onMonthlyPriceChange,
  onMonthlyChurnRateChange,
  onSalesRepsChange,
  onSalesProductivityChange,
  onWinRateChange,
  onMarketingSpendChange,
  onOtherHeadcountChange,
  onFixedOperatingCostsChange,
  onGrossMarginChange,
}: DriverPanelProps) {
  return (
    <section>

      <DriverControl
        label="Monthly price"
        value={monthlyPricePerCustomer}
        min={0}
        max={5000}
        step={10}
        formatValue={(value) => formatCurrency(value)}
        onChange={onMonthlyPriceChange}
      />

      <DriverControl
        label="Monthly churn"
        value={monthlyChurnRate * 100}
        min={0}
        max={20}
        step={0.1}
        formatValue={(value) =>
          formatPercent(value / 100, 1)
        }
        onChange={(value) =>
          onMonthlyChurnRateChange(value / 100)
        }
      />

      <DriverControl
        label="Sales reps"
        value={salesReps}
        min={0}
        max={50}
        step={1}
        formatValue={(value) => formatNumber(value)}
        onChange={onSalesRepsChange}
      />

      <DriverControl
        label="Sales opportunities"
        value={opportunitiesPerRepPerMonth}
        min={0}
        max={50}
        step={1}
        formatValue={(value) => formatNumber(value)}
        onChange={onSalesProductivityChange}
      />

      <DriverControl
        label="Win rate"
        value={winRate * 100}
        min={0}
        max={100}
        step={1}
        formatValue={(value) =>
          formatPercent(value / 100, 0)
        }
        onChange={(value) =>
          onWinRateChange(value / 100)
        }
      />

      <DriverControl
        label="Monthly marketing spend"
        value={marketingSpendPerMonth}
        min={0}
        max={100000}
        step={1000}
        formatValue={(value) => formatCurrency(value)}
        onChange={onMarketingSpendChange}
      />

      <DriverControl
        label="Other employees"
        value={otherHeadcount}
        min={0}
        max={50}
        step={1}
        formatValue={(value) => formatNumber(value)}
        onChange={onOtherHeadcountChange}
      />

      <DriverControl
        label="Fixed operating costs"
        value={fixedOperatingCostsPerMonth}
        min={0}
        max={100000}
        step={1000}
        formatValue={(value) => formatCurrency(value)}
        onChange={onFixedOperatingCostsChange}
      />

      <DriverControl
        label="Gross margin"
        value={grossMargin * 100}
        min={0}
        max={100}
        step={1}
        formatValue={(value) =>
          formatPercent(value / 100, 0)
        }
        onChange={(value) =>
          onGrossMarginChange(value / 100)
        }
      />
    </section>
  );
}

export default DriverPanel;