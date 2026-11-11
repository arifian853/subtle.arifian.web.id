import { useEffect, useId, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Scrollbar } from "./ui/scrollbar";

export const chartKinds = ["area", "bar", "line", "pie", "composed"] as const;
type ChartKind = (typeof chartKinds)[number];
export const studioSeries = [
  { month: "Jan", studies: 24, reviews: 16 },
  { month: "Feb", studies: 32, reviews: 22 },
  { month: "Mar", studies: 28, reviews: 24 },
  { month: "Apr", studies: 42, reviews: 30 },
  { month: "May", studies: 38, reviews: 32 },
  { month: "Jun", studies: 48, reviews: 40 },
];
const pieSeries = studioSeries.map((row, index) => ({
  ...row,
  fill: index % 2 ? "var(--secondary)" : "var(--primary)",
}));
const primary = "var(--primary)";
const secondary = "var(--secondary)";
const names = {
  area: "Activity over time",
  bar: "Studies and reviews",
  line: "Two related trends",
  pie: "Share of study activity",
  composed: "Volume with review trend",
};
const guidance = {
  area: "Use area to show volume across a continuous interval. The baseline stays at zero.",
  bar: "Compare discrete monthly counts with adjacent bars and a shared zero baseline.",
  line: "Compare direction over time. Solid and dashed strokes distinguish the series without color.",
  pie: "Use part-to-whole only when categories sum to a meaningful total. Labels name every slice.",
  composed:
    "Combine volume and trend only when the units agree. Both series here count studio activities.",
};
/** Keep tables available; mount plots only after hydration knows the preference. */
function useChartEntrance() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return {
    ready: allowed !== null,
    isAnimationActive: allowed === true,
    animationDuration: 220,
    animationEasing: "ease-out" as const,
    animationBegin: 0,
  };
}
/** Shared chart anatomy with one short entrance and no scrolling capture. */
export function ChartSpecimen({ kind = "area" }: { kind?: ChartKind }) {
  const id = useId();
  const { ready, ...entrance } = useChartEntrance();
  const tooltip = (
    <Tooltip
      contentStyle={{
        background: "var(--bg-surface)",
        color: "var(--text-main)",
        border: "1px solid var(--border-active)",
        borderRadius: 10,
      }}
      itemStyle={{ color: "var(--text-main)" }}
      cursor={{ stroke: "var(--border-active)" }}
    />
  );
  const axes = (
    <>
      <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
      <XAxis dataKey="month" tick={{ fill: "var(--text-main)" }} />
      <YAxis width={36} domain={[0, 60]} tick={{ fill: "var(--text-main)" }} />
    </>
  );
  const legend = <Legend wrapperStyle={{ color: "var(--text-main)" }} />;
  const a11y = {
    accessibilityLayer: true,
    title: names[kind],
    desc: "Synthetic activity counts. Use arrow keys to explore values; the data table below contains every value.",
  };
  const chart =
    kind === "area" ? (
      <AreaChart data={studioSeries} {...a11y}>
        {axes}
        {tooltip}
        {legend}
        <Area
          name="Studies"
          dataKey="studies"
          stroke={primary}
          fill="var(--primary-container)"
          strokeWidth={2}
          {...entrance}
        />
      </AreaChart>
    ) : kind === "bar" ? (
      <BarChart data={studioSeries} {...a11y}>
        {axes}
        {tooltip}
        {legend}
        <Bar
          name="Studies"
          dataKey="studies"
          fill={primary}
          radius={[6, 6, 0, 0]}
          {...entrance}
        />
        <Bar
          name="Reviews"
          dataKey="reviews"
          fill={secondary}
          radius={[6, 6, 0, 0]}
          {...entrance}
        />
      </BarChart>
    ) : kind === "line" ? (
      <LineChart data={studioSeries} {...a11y}>
        {axes}
        {tooltip}
        {legend}
        <Line
          name="Studies"
          dataKey="studies"
          stroke={primary}
          strokeWidth={2}
          {...entrance}
        />
        <Line
          name="Reviews"
          dataKey="reviews"
          stroke={secondary}
          strokeDasharray="5 4"
          strokeWidth={2}
          {...entrance}
        />
      </LineChart>
    ) : kind === "pie" ? (
      <PieChart {...a11y}>
        {tooltip}
        {legend}
        <Pie
          data={pieSeries}
          nameKey="month"
          dataKey="studies"
          outerRadius="50%"
          label={({ name, value }) => `${name}: ${value}`}
          stroke="var(--bg-surface)"
          {...entrance}
        />
      </PieChart>
    ) : (
      <ComposedChart data={studioSeries} {...a11y}>
        {axes}
        {tooltip}
        {legend}
        <Bar
          name="Studies"
          dataKey="studies"
          fill="var(--primary-container)"
          stroke={primary}
          radius={[6, 6, 0, 0]}
          {...entrance}
        />
        <Line
          name="Reviews"
          dataKey="reviews"
          stroke={secondary}
          strokeWidth={3}
          strokeDasharray="5 4"
          {...entrance}
        />
      </ComposedChart>
    );
  return (
    <figure
      className={`chart-study chart-${kind}`}
      aria-labelledby={`${id}-title`}
    >
      <figcaption>
        <p className="product-meta">{kind} / Synthetic studio activity</p>
        <h2 id={`${id}-title`}>{names[kind]}</h2>
        <p>{guidance[kind]}</p>
      </figcaption>
      <div className="chart-plot">
        {ready && <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 640, height: 300 }}
        >
          {chart}
        </ResponsiveContainer>}
      </div>
      <p className="product-meta">
        Counts, January–June. Hover or focus the plot and use arrow keys. Values
        are also available below. Series enter once over 220 ms with ease-out;
        reduced motion shows the final values immediately.
      </p>
      <details>
        <summary>View {kind} chart data</summary>
        <Scrollbar label={`${kind} chart data`} className="chart-data">
          <table className="data-table">
            <caption>{names[kind]}: synthetic counts</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Studies</th>
                {kind !== "pie" && kind !== "area" && (
                  <th scope="col">Reviews</th>
                )}
              </tr>
            </thead>
            <tbody>
              {studioSeries.map((row) => (
                <tr key={row.month}>
                  <th scope="row">{row.month}</th>
                  <td>{row.studies}</td>
                  {kind !== "pie" && kind !== "area" && <td>{row.reviews}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Scrollbar>
      </details>
    </figure>
  );
}
export function Charts() {
  return (
    <div className="chart-studies">
      {chartKinds.map((kind) => (
        <ChartSpecimen key={kind} kind={kind} />
      ))}
    </div>
  );
}
