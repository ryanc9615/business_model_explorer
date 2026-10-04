type DriverControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

function DriverControl({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
  formatValue,
}: DriverControlProps) {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className="driver-control">
      <div className="driver-control-header">
        <label className="driver-label">{label}</label>

        <div className="driver-value-group">
          {prefix && <span className="driver-unit">{prefix}</span>}

          <input
            className="driver-value-box"
            type="text"
            value={displayValue}
            readOnly
          />

          {suffix && <span className="driver-unit">{suffix}</span>}
        </div>
      </div>

      <input
        className="driver-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export default DriverControl;