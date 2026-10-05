import KPICard from "./KPICard"
import { calculateProjection } from "../model/calculateProjection"

type KPIGridProps = {
    projection: ReturnType<typeof calculateProjection>
    baselineProjection: ReturnType<typeof calculateProjection>
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value)
}

function formatCurrencyComparison(delta: number) {
    if (delta === 0) {
        return "No change vs baseline"
    }

    const sign = delta > 0 ? "+" : "-"

    return `${sign}${formatCurrency(Math.abs(delta))} vs baseline`
}

function formatNumberComparison(delta: number) {
    if (delta === 0) {
        return "No change vs baseline"
    }

    const sign = delta > 0 ? "+" : "-"

    return `${sign}${Math.abs(delta).toFixed(1)} vs baseline`
}

function formatRunway(value: number | null) {
    if (value === null) {
        return ">12 months"
    }

    return `${value.toFixed(1)} months`
}

function KPIGrid({
    projection,
    baselineProjection,
}: KPIGridProps) {
    const summary = projection.summary
    const baseline = baselineProjection.summary

    const customerDelta =
        summary.exitCustomers - baseline.exitCustomers

    const arrDelta =
        summary.exitARR - baseline.exitARR

    const revenueDelta =
        summary.yearOneRevenue - baseline.yearOneRevenue

    const grossProfitDelta =
        summary.yearOneGrossProfit - baseline.yearOneGrossProfit

    const ebitdaDelta =
        summary.yearOneEbitda - baseline.yearOneEbitda

    const cashDelta =
        summary.endingCash - baseline.endingCash

    return (
        <section>
            <h2>Outcomes</h2>

            <div className="kpi-grid">
                <KPICard
                    label="Customers"
                    value={summary.exitCustomers.toFixed(0)}
                    comparison={formatNumberComparison(customerDelta)}
                />

                <KPICard
                    label="ARR"
                    value={formatCurrency(summary.exitARR)}
                    comparison={formatCurrencyComparison(arrDelta)}
                />

                <KPICard
                    label="Year 1 Revenue"
                    value={formatCurrency(summary.yearOneRevenue)}
                    comparison={formatCurrencyComparison(revenueDelta)}
                />

                <KPICard
                    label="Year 1 Gross Profit"
                    value={formatCurrency(summary.yearOneGrossProfit)}
                    comparison={formatCurrencyComparison(grossProfitDelta)}
                />

                <KPICard
                    label="Year 1 EBITDA"
                    value={formatCurrency(summary.yearOneEbitda)}
                    comparison={formatCurrencyComparison(ebitdaDelta)}
                />

                <KPICard
                    label="Ending Cash"
                    value={formatCurrency(summary.endingCash)}
                    comparison={formatCurrencyComparison(cashDelta)}
                />

                <KPICard
                    label="Runway"
                    value={formatRunway(summary.runwayMonths)}
                />
            </div>
        </section>
    )
}

export default KPIGrid