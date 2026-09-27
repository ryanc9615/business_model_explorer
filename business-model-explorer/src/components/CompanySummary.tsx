type CompanySummaryProps = {
    companyName: string
    description: string
}

function CompanySummary({
    companyName,
    description,
}: CompanySummaryProps) {
    return (
        <section>
            <h2>{companyName}</h2>
            <p>{description}</p>
        </section>
    )
}

export default CompanySummary