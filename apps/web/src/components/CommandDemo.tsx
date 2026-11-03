import { useId, useState } from "react";
import { listCatalog } from "@subtle/catalog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldLabel, Input } from "./ui/field";

export function CommandDemo() {
  const id = useId();
  const [query, setQuery] = useState("");
  const results = listCatalog({ query, limit: 8 });
  return (
    <div className="command-preview">
      <Dialog>
        <DialogTrigger className="command-bar">
          <span>
            <span aria-hidden="true">⌕</span> Search the system…
          </span>
          <span className="mono" aria-hidden="true">
            Open search ↗
          </span>
        </DialogTrigger>
        <DialogContent
          className="command-dialog"
          onKeyDown={(event) => {
            if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
            const links = [
              ...event.currentTarget.querySelectorAll<HTMLAnchorElement>(
                ".command-result",
              ),
            ];
            if (!links.length) return;
            event.preventDefault();
            const current = links.indexOf(
              document.activeElement as HTMLAnchorElement,
            );
            const direction = event.key === "ArrowDown" ? 1 : -1;
            const next =
              current < 0
                ? direction === 1
                  ? 0
                  : links.length - 1
                : (current + direction + links.length) % links.length;
            links[next]?.focus();
          }}
        >
          <DialogTitle>Find your next piece.</DialogTitle>
          <DialogDescription>
            Search the public components, patterns, foundations, and moods.
          </DialogDescription>
          <Field>
            <FieldLabel htmlFor={`${id}-search`}>Search the system</FieldLabel>
            <Input
              id={`${id}-search`}
              type="search"
              name="command-search"
              maxLength={80}
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try layered sheet…"
            />
          </Field>
          <p role="status" className="product-meta">
            {results.total
              ? `${results.total} results. Showing ${results.items.length}.`
              : "No matches. Try a shorter name."}
          </p>
          <ul className="command-results">
            {results.items.map((item) => (
              <li key={item.id}>
                <a className="command-result" href={item.href}>
                  <span>{item.title}</span>
                  <span>
                    {item.category} <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
      <div className="signature-description">
        <h3>Soft Command Bar</h3>
        <p>A clear place to begin.</p>
      </div>
    </div>
  );
}
