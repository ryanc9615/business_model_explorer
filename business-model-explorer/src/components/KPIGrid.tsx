import KPICard from "./KPICard"

function KPIGrid() {
    return (
        <section>
            <h2>Outcomes</h2>
            <div className="kpi-grid">
                <KPICard label = "Customers" value="120" />
                <KPICard label = "ARR" value="£2.16m" />
                <KPICard label = "Revenue" value="£1.80m" />
                <KPICard label = "Gross Profit" value="£1.44m" />
                <KPICard label = "EBITDA" value="£420k" />
                <KPICard label = "Cash" value="£1.20m" />
                <KPICard label = "Runway" value="18 months" />
            </div>    
        </section>
    )
}

export default KPIGrid