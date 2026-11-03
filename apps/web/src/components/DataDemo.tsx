import { useId, useState } from "react";
import { Input, Field, FieldLabel } from "./ui/field";
import { Badge, Empty } from "./ui/feedback";
import { Chart } from "./Homepage";
const projects = [
  { name: "Everyday objects", progress: 84, status: "In review" },
  { name: "A slower morning", progress: 56, status: "In progress" },
  { name: "Notes from the studio", progress: 100, status: "Complete" },
];
export function Metric() {
  return (
    <div className="metric">
      <p>Weekly activity</p>
      <div className="metric-line">
        <strong>68</strong>
        <span className="status">↑ 12 this week</span>
      </div>
      <Chart />
      <p className="product-meta demo-note">Synthetic activity / 7 days</p>
    </div>
  );
}
export function DataDemo() {
  const id = useId();
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<"none" | "ascending" | "descending">("none");
  const filtered = projects.filter((row) =>
    row.name.toLowerCase().includes(filter.toLowerCase()),
  );
  const rows =
    sort === "none"
      ? filtered
      : filtered.toSorted((a, b) =>
          sort === "ascending"
            ? a.progress - b.progress
            : b.progress - a.progress,
        );
  return (
    <div className="data-demo">
      <div className="section-head">
        <div>
          <p className="product-meta">Fieldnotes / Synthetic workspace</p>
          <h3>Studio overview</h3>
        </div>
        <Badge>All changes saved</Badge>
      </div>
      <Field>
        <FieldLabel htmlFor={`${id}-filter`}>Filter studio projects</FieldLabel>
        <Input
          type="search"
          name="project-filter"
          id={`${id}-filter`}
          autoComplete="off"
          value={filter}
          maxLength={80}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Try objects…"
        />
      </Field>
      {rows.length ? (
        <div
          className="table-scroll"
          role="region"
          tabIndex={0}
          aria-label="Synthetic studio projects table, scroll horizontally"
        >
          <table className="data-table" aria-label="Synthetic studio projects">
            <thead>
              <tr>
                <th>Project</th>
                <th aria-sort={sort}>
                  <button
                    onClick={() =>
                      setSort(sort === "ascending" ? "descending" : "ascending")
                    }
                    aria-label="Sort by progress"
                  >
                    Progress{" "}
                    <span aria-hidden="true">
                      {sort === "ascending" ? "↑" : "↓"}
                    </span>
                  </button>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.progress}%</td>
                  <td>
                    <Badge
                      variant={
                        row.status === "In progress" ? "pending" : "success"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title="No projects match">
          <p>Try a shorter project name or clear the filter.</p>
        </Empty>
      )}
    </div>
  );
}
