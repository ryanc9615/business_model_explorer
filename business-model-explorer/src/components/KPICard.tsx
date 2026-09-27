type KPICardProps = {
    label: string
    value: string
}

function KPICard({
    label,
    value,
}: KPICardProps) {
    return (
        <div className="kpi-card">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    )
}

export default KPICard