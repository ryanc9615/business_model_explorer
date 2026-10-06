type KPICardProps = {
  label: string;
  value: number | string;
  formatValue?: (value: number) => string;
  comparison?: string;
};

function KPICard({
  label,
  value,
  formatValue,
  comparison,
}: KPICardProps) {
  const displayValue =
    typeof value === "number" && formatValue
      ? formatValue(value)
      : value;

  return (
    <div className="kpi-card">
      <span className="kpi-label">
        {label}
      </span>

      <strong className="kpi-value">
        {displayValue}
      </strong>

      {comparison && (
        <span className="kpi-comparison">
          {comparison}
        </span>
      )}
    </div>
  );
}

export default KPICard;