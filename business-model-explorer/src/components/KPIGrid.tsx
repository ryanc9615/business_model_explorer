import KPICard from "./KPICard";
import { calculateProjection } from "../model/calculateProjection";
import {
  formatCurrency,
  formatNumber,
} from "../utils/formatters";

type KPIGridProps = {
  projection: ReturnType<typeof calculateProjection>;
  baselineProjection: ReturnType<typeof calculateProjection>;
};

function formatCurrencyComparison(delta: number): string {
  if (delta === 0) {
    return "No change vs baseline";
  }

  const sign = delta > 0 ? "+" : "−";

  return `${sign}${formatCurrency(Math.abs(delta))} vs baseline`;
}

function formatNumberComparison(delta: number): string {
  if (delta === 0) {
    return "No change vs baseline";
  }

  const sign = delta > 0 ? "+" : "−";

  return `${sign}${formatNumber(Math.abs(delta), 1)} vs baseline`;
}

function formatRunway(value: number | null): string {
  if (value === null) {
    return ">12 months";
  }

  return `${formatNumber(value, 1)} months`;
}

function KPIGrid({
  projection,
  baselineProjection,
}: KPIGridProps) {
  const summary = projection.summary;
  const baseline = baselineProjection.summary;

  const customerDelta =
    summary.exitCustomers - baseline.exitCustomers;

  const arrDelta =
    summary.exitARR - baseline.exitARR;

  const revenueDelta =
    summary.yearOneRevenue - baseline.yearOneRevenue;

  const grossProfitDelta =
    summary.yearOneGrossProfit - baseline.yearOneGrossProfit;

  const ebitdaDelta =
    summary.yearOneEbitda - baseline.yearOneEbitda;

  const cashDelta =
    summary.endingCash - baseline.endingCash;

  return (
    <section className="outcomes-section">
      <h2>Outcomes</h2>

      <div className="kpi-grid">
        <KPICard
          label="Customers"
          value={summary.exitCustomers}
          formatValue={(value) => formatNumber(value)}
          comparison={formatNumberComparison(customerDelta)}
        />

        <KPICard
          label="ARR"
          value={summary.exitARR}
          formatValue={formatCurrency}
          comparison={formatCurrencyComparison(arrDelta)}
        />

        <KPICard
          label="Year 1 Revenue"
          value={summary.yearOneRevenue}
          formatValue={formatCurrency}
          comparison={formatCurrencyComparison(revenueDelta)}
        />

        <KPICard
          label="Year 1 Gross Profit"
          value={summary.yearOneGrossProfit}
          formatValue={formatCurrency}
          comparison={formatCurrencyComparison(grossProfitDelta)}
        />

        <KPICard
          label="Year 1 EBITDA"
          value={summary.yearOneEbitda}
          formatValue={formatCurrency}
          comparison={formatCurrencyComparison(ebitdaDelta)}
        />

        <KPICard
          label="Ending Cash"
          value={summary.endingCash}
          formatValue={formatCurrency}
          comparison={formatCurrencyComparison(cashDelta)}
        />

        <KPICard
          label="Runway"
          value={formatRunway(summary.runwayMonths)}
        />
      </div>
    </section>
  );
}

export default KPIGrid;