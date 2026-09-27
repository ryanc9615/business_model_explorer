type DriverControlProps = {
    label: string
    value: string
}

function DriverControl({
    label,
    value,
}: DriverControlProps) {
    return (
        <div className="driver-control">
            <span>{label}</span>
            <span>{value}</span>
        </div>
    )
}

export default DriverControl