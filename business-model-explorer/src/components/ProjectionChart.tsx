import { useState } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { calculateProjection } from "../model/calculateProjection";
import {
  formatCurrency,
  formatNumber,
} from "../utils/formatters";

type Projection = ReturnType<typeof calculateProjection>;
type ProjectionMonth = Projection["months"][number];

type ProjectionChartProps = {
  projection: Projection;
  baselineProjection: Projection;
};

type Metric = "customers" | "revenue" | "ebitda" | "cash";

type MetricField =
  | "endingCustomers"
  | "revenue"
  | "ebitda"
  | "endingCash";

type MetricDefinition = {
  label: string;
  field: MetricField;
  format: (value: number) => string;
};

const metricDefinitions: Record<Metric, MetricDefinition> = {
  customers: {
    label: "Customers",
    field: "endingCustomers",
    format: (value) => formatNumber(value),
  },

  revenue: {
    label: "Revenue",
    field: "revenue",
    format: (value) => formatCurrency(value),
  },

  ebitda: {
    label: "EBITDA",
    field: "ebitda",
    format: (value) => formatCurrency(value),
  },

  cash: {
    label: "Cash",
    field: "endingCash",
    format: (value) => formatCurrency(value),
  },
};

export function ProjectionChart({
  projection,
  baselineProjection,
}: ProjectionChartProps) {
  const [metric, setMetric] =
    useState<Metric>("customers");

  const metricDefinition =
    metricDefinitions[metric];

  const chartData = projection.months.map(
    (scenarioMonth: ProjectionMonth, index) => {
      const baselineMonth =
        baselineProjection.months[index];

      return {
        month: scenarioMonth.month,
        baseline:
          baselineMonth[metricDefinition.field],
        scenario:
          scenarioMonth[metricDefinition.field],
      };
    }
  );

  return (
    <section className="projection-chart">
      <div className="projection-chart__header">
        <h2>12-Month Projection</h2>

        <div
          className="projection-chart__metrics"
          role="group"
          aria-label="Projection metric"
        >
          {(Object.keys(metricDefinitions) as Metric[]).map(
            (metricKey) => (
              <button
                key={metricKey}
                type="button"
                className={
                  metric === metricKey
                    ? "projection-chart__metric projection-chart__metric--active"
                    : "projection-chart__metric"
                }
                aria-pressed={metric === metricKey}
                onClick={() => setMetric(metricKey)}
              >
                {metricDefinitions[metricKey].label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="projection-chart__canvas">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 24,
              left: -8,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              interval={0}
              tickMargin={8}
              tick={{ fontSize: 13 }}
            />

            <YAxis
              tickFormatter={(value) =>
                metricDefinition.format(
                  Number(value)
                )
              }
            />

            <Tooltip
              labelFormatter={(month) =>
                `Month ${month}`
              }
              formatter={(value) =>
                metricDefinition.format(
                  Number(value)
                )
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline"
              stroke="#94a3b8"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="scenario"
              name="Scenario"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}