type CompanySummaryProps = {
  companyName: string;
  description: string;
};

function CompanySummary({
  description,
}: CompanySummaryProps) {
  return (
    <section aria-labelledby="company-summary-heading">
      <h2 id="company-summary-heading">
        Company Overview
      </h2>

      <p>{description}</p>
    </section>
  );
}
export default CompanySummary;