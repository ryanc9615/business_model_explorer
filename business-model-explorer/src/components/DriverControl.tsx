import { useId } from "react";

type DriverControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

function DriverControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: DriverControlProps) {
  const id = useId();

  const displayValue = formatValue
    ? formatValue(value)
    : value.toString();

  return (
    <div className="driver-control">
      <div className="driver-control-header">
        <label
          className="driver-label"
          htmlFor={id}
        >
          {label}
        </label>

        <div className="driver-value-group">
          <output
            className="driver-value-box"
            htmlFor={id}
          >
            {displayValue}
          </output>
        </div>
      </div>

      <input
        id={id}
        className="driver-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={displayValue}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
      />
    </div>
  );
}

export default DriverControl;