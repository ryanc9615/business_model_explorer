import KPICard from "./KPICard"
import { calculateProjection } from "../model/calculateProjection"

type KPIGridProps = {
    projection: ReturnType<typeof calculateProjection>
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(value)
}

function formatRunway(value: number | null) {
    if (value === null) {
        return ">12 months"
    }

    return `${value.toFixed(1)} months`
}

function KPIGrid({ projection }: KPIGridProps) {
    const summary = projection.summary

    return (
        <section>
            <h2>Outcomes</h2>

            <div className="kpi-grid">
                <KPICard
                    label="Customers"
                    value={summary.exitCustomers.toFixed(0)}
                />

                <KPICard label="ARR" value={formatCurrency(summary.exitARR)} />
                <KPICard label="Year 1 Revenue" value={formatCurrency(summary.yearOneRevenue)} />
                <KPICard label="Year 1 Gross Profit" value={formatCurrency(summary.yearOneGrossProfit)} />
                <KPICard label="Year 1 EBITDA" value={formatCurrency(summary.yearOneEbitda)} />
                <KPICard label="Ending Cash" value={formatCurrency(summary.endingCash)} />
                <KPICard label="Runway" value={formatRunway(summary.runwayMonths)} />
            </div>
        </section>
    )
}

export default KPIGrid