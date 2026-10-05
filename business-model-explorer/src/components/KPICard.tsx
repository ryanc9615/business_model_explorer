type KPICardProps = {
    label: string
    value: string
    comparison?: string
}

function KPICard({
    label,
    value,
    comparison,
}: KPICardProps) {
    return (
        <div className="kpi-card">
        <span className="kpi-label">{label}</span>

        <strong className="kpi-value">
            {value}
        </strong>

        {comparison && (
            <span className="kpi-comparison">
            {comparison}
            </span>
        )}
        </div>
  )
}

export default KPICard