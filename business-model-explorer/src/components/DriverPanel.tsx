import DriverControl from "./DriverControl";

type DriverPanelProps = {
  monthlyPricePerCustomer: number;
  monthlyChurnRate: number;
  salesReps: number;
  opportunitiesPerRepPerMonth: number;
  winRate: number;
  marketingSpendPerMonth: number;
  otherHeadcount: number;
  grossMargin: number;

  onMonthlyPriceChange: (value: number) => void;
  onMonthlyChurnRateChange: (value: number) => void;
  onSalesRepsChange: (value: number) => void;
  onSalesProductivityChange: (value: number) => void;
  onWinRateChange: (value: number) => void;
  onMarketingSpendChange: (value: number) => void;
  onOtherHeadcountChange: (value: number) => void;
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
  grossMargin,
  onMonthlyPriceChange,
  onMonthlyChurnRateChange,
  onSalesRepsChange,
  onSalesProductivityChange,
  onWinRateChange,
  onMarketingSpendChange,
  onOtherHeadcountChange,
  onGrossMarginChange,
}: DriverPanelProps) {
  return (
    <section>
      <h2>Business Drivers</h2>

      <DriverControl
        label="Monthly price"
        value={monthlyPricePerCustomer}
        min={500}
        max={5000}
        step={10}
        prefix="£"
        onChange={onMonthlyPriceChange}
      />

      <DriverControl
        label="Monthly churn"
        value={monthlyChurnRate * 100}
        min={0}
        max={20}
        step={0.1}
        prefix="%"
        formatValue={(value) => value.toFixed(1)}
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
        prefix="#"
        onChange={onSalesRepsChange}
      />

      <DriverControl
        label="Sales opportunities"
        value={opportunitiesPerRepPerMonth}
        min={0}
        max={50}
        step={1}
        prefix="#"
        onChange={onSalesProductivityChange}
      />

      <DriverControl
        label="Win rate"
        value={winRate * 100}
        min={0}
        max={100}
        step={1}
        prefix="%"
        formatValue={(value) => value.toFixed(0)}
        onChange={(value) =>
          onWinRateChange(value / 100)
        }
      />

      <DriverControl
        label="Monthly Marketing spend"
        value={marketingSpendPerMonth}
        min={0}
        max={100000}
        step={1000}
        prefix="£"
        formatValue={(value) => value.toLocaleString()}
        onChange={onMarketingSpendChange}
      />

      <DriverControl
        label="Other employees"
        value={otherHeadcount}
        min={0}
        max={50}
        step={1}
        prefix="#"
        onChange={onOtherHeadcountChange}
      />

      <DriverControl
        label="Gross margin"
        value={grossMargin * 100}
        min={0}
        max={100}
        step={1}
        prefix="%"
        formatValue={(value) => value.toFixed(0)}
        onChange={(value) =>
          onGrossMarginChange(value / 100)
        }
      />
    </section>
  );
}

export default DriverPanel;