import { lazy, Suspense, useEffect, useId, useState } from "react";
import {
  catalog,
  componentCategories,
  componentHierarchy,
  type CatalogItem,
} from "@subtle/catalog";
import { Button } from "./ui/button";
import { Field, FieldLabel, Input } from "./ui/field";
import { Badge, Progress } from "./ui/feedback";
import { SettingsForm } from "./SettingsForm";
import { OverlayDemo } from "./OverlayDemo";
import { CommandDemo } from "./CommandDemo";
import { Conversation } from "./Conversation";
import { DataDemo, Metric } from "./DataDemo";
import { Botanical } from "./Homepage";
import { ModeComparison } from "./ModeComparison";
import { MoodSwitcher } from "./MoodSwitcher";
import { FeedbackDemo } from "./FeedbackDemo";
import { Select } from "./ui/select";
import { Scrollbar } from "./ui/scrollbar";
import { CompactMoodPicker, MoodPicker } from "./MoodPicker";
const ChartSpecimen = lazy(() =>
  import("./Charts").then((module) => ({ default: module.ChartSpecimen })),
);
const components = catalog.filter((item) => item.kind === "component");

function ActionsSpecimen() {
  const [message, setMessage] = useState(
    "Choose an action to see its feedback.",
  );
  return (
    <div className="action-specimen">
      <div className="actions">
        {(
          ["primary", "secondary", "outline", "ghost", "destructive"] as const
        ).map((variant) => (
          <Button
            variant={variant}
            key={variant}
            onClick={() =>
              setMessage(
                `${variant[0]!.toUpperCase()}${variant.slice(1)} action selected. Demo state only.`,
              )
            }
          >
            {variant[0]!.toUpperCase()}
            {variant.slice(1)}
          </Button>
        ))}
        <Button disabled>Unavailable</Button>
        <Button disabled aria-busy="true">
          Saving…
        </Button>
        <Button
          size="icon"
          variant="secondary"
          aria-label="Add a note"
          onClick={() => setMessage("A note added to this demo.")}
        >
          <span aria-hidden="true">+</span>
        </Button>
      </div>
      <p role="status" className="product-meta">
        {message}
      </p>
    </div>
  );
}
export function CanonicalSpecimen({ id }: { id: string }) {
  if (["button", "icon-button"].includes(id)) return <ActionsSpecimen />;
  if (["input", "select", "checkbox"].includes(id)) return <SettingsForm />;
  if (["textarea", "ai-message", "ai-composer"].includes(id))
    return <Conversation />;
  if (["dialog", "sheet", "inspector"].includes(id)) return <OverlayDemo />;
  if (id === "command") return <CommandDemo />;
  if (id === "scrollbar")
    return (
      <Scrollbar label="Scrollable studio notes" style={{ maxHeight: 200 }}>
        <ol>
          {Array.from({ length: 20 }, (_, index) => (
            <li key={index}>
              Studio note {index + 1}: keep the reading order clear.
            </li>
          ))}
        </ol>
      </Scrollbar>
    );
  if (id === "mood-picker")
    return (
      <div className="mood-picker-variants">
        <section>
          <p className="product-meta">Compact / Appearance menu</p>
          <CompactMoodPicker />
        </section>
        <section>
          <p className="product-meta">Inline / Full mood choices</p>
          <MoodPicker />
        </section>
      </div>
    );
  if (id === "chart")
    return (
      <Suspense
        fallback={
          <p>
            Loading chart. Data: Jan 24, Feb 32, Mar 28, Apr 42, May 38, Jun 48
            studies.
          </p>
        }
      >
        <ChartSpecimen />
      </Suspense>
    );
  if (id === "mood-switcher") return <MoodSwitcher />;
  if (id === "tabs") return <ModeComparison />;
  if (id === "data-table") return <DataDemo />;
  if (id === "metric") return <Metric />;
  if (id === "media") return <Botanical />;
  if (["toast", "skeleton", "empty"].includes(id)) return <FeedbackDemo />;
  if (id === "status")
    return (
      <div className="actions">
        <Badge>Available</Badge>
        <Badge variant="pending">Pending</Badge>
        <Badge variant="error">Needs attention</Badge>
      </div>
    );
  if (id === "progress")
    return <Progress value={68} label="Collection progress" />;
  if (id === "context-capsule")
    return <span className="context-capsule">Fieldnotes / Collection</span>;
  if (id === "adaptive-header")
    return (
      <nav className="specimen-nav" aria-label="Specimen navigation">
        <a className="wordmark" href="/">
          subtle<span aria-hidden="true">✳</span>
        </a>
        <a href="/foundations/">Foundations</a>
        <a href="/patterns/">Patterns</a>
      </nav>
    );
  if (id === "mosaic-tile")
    return (
      <div className="mini-mosaic">
        <Botanical />
        <Metric />
      </div>
    );
  return (
    <article className="tonal-card">
      <p className="product-meta">A considered grouping</p>
      <h3>Room for the everyday.</h3>
      <p>One clear task, contained by tone.</p>
    </article>
  );
}
export function Explorer({
  initialCategory = "",
}: {
  initialCategory?: string;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [selected, setSelected] = useState<CatalogItem>(
    components.find(
      (item) => !initialCategory || item.category === initialCategory,
    )!,
  );
  useEffect(() => {
    const read = () => {
      const found = components.find(
        (item) => item.id === window.location.hash.slice(1),
      );
      if (found) setSelected(found);
    };
    const params = new URLSearchParams(window.location.search);
    setQuery((params.get("q") ?? "").slice(0, 80));
    const storedCategory = params.get("category");
    if (storedCategory && componentCategories.includes(storedCategory))
      setCategory(storedCategory);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  function updateFilter(nextQuery: string, nextCategory: string) {
    setQuery(nextQuery);
    setCategory(nextCategory);
    const url = new URL(window.location.href);
    nextQuery
      ? url.searchParams.set("q", nextQuery)
      : url.searchParams.delete("q");
    nextCategory
      ? url.searchParams.set("category", nextCategory)
      : url.searchParams.delete("category");
    window.history.replaceState(null, "", url);
  }
  const results = components.filter(
    (item) =>
      (!category || item.category === category) &&
      `${item.title} ${item.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="explorer">
      <aside className="explorer-sidebar">
        <Field>
          <FieldLabel htmlFor={`${id}-query`}>Find a component</FieldLabel>
          <Input
            id={`${id}-query`}
            name="component-search"
            type="search"
            autoComplete="off"
            maxLength={80}
            value={query}
            onChange={(event) => updateFilter(event.target.value, category)}
            placeholder="Try button…"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-category`}>Component category</FieldLabel>
          <Select
            id={`${id}-category`}
            name="category"
            label="Component category"
            value={category}
            onValueChange={(value) => updateFilter(query, value)}
            options={[
              { value: "", label: "All categories" },
              ...componentCategories.map((value) => ({ value, label: value })),
            ]}
          />
        </Field>
        <p className="product-meta" role="status">
          {results.length
            ? `${results.length} catalog entries`
            : "No matches. Clear a filter or try a shorter name."}
        </p>
        <nav aria-label="Component families" tabIndex={0} className="scrollbar">
          {componentHierarchy.map((group) => {
            const families = group.families.filter((family) =>
              family.ids.some((id) => results.some((item) => item.id === id)),
            );
            return families.length ? (
              <div key={group.title} className="family-group">
                <h2>{group.title}</h2>
                {families.map((family) => {
                  const item = components.find(
                    (item) => item.id === family.ids[0],
                  )!;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      aria-current={
                        family.ids.includes(selected.id) ? "true" : undefined
                      }
                      onClick={() => setSelected(item)}
                    >
                      {family.ids.length > 1
                        ? "Button / Icon Button"
                        : item.title}
                    </a>
                  );
                })}
              </div>
            ) : null;
          })}
        </nav>
      </aside>
      <article className="explorer-detail" id={selected.id}>
        <p className="kicker">{selected.category} / Canonical family</p>
        <h2>{selected.title}</h2>
        <p className="detail-lead">{selected.description}</p>
        <div className="specimen-stage">
          <CanonicalSpecimen key={selected.id} id={selected.id} />
        </div>
        <div className="detail-notes">
          <div>
            <h3>Use it with intention</h3>
            <p>{selected.usage}</p>
          </div>
          <div>
            <h3>Keyboard & accessibility</h3>
            <p>{selected.accessibility}</p>
          </div>
        </div>
        <p className="product-meta">States: {selected.states.join(", ")}</p>
        <p className="product-meta">{selected.provenance}</p>
      </article>
    </div>
  );
}
