import { useId, useState } from "react";
import { Field, FieldLabel, Input } from "./ui/field";
import { Empty } from "./ui/feedback";
const files = [
  {
    name: "Studio notes",
    type: "Text note",
    size: "2 KB",
    content: "A synthetic note about everyday objects.",
  },
  {
    name: "Morning collection",
    type: "Collection",
    size: "8 items",
    content: "A synthetic collection of cups, books, and small observations.",
  },
  {
    name: "Shape studies",
    type: "Vector study",
    size: "4 shapes",
    content: "A synthetic study of nested rounded shapes.",
  },
];
export function FileCollection() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(
    "Select a synthetic file to preview its contents.",
  );
  const visible = files.filter((file) =>
    file.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="file-collection">
      <Field>
        <FieldLabel htmlFor={`${id}-files`}>Find a studio file</FieldLabel>
        <Input
          id={`${id}-files`}
          type="search"
          name="file-search"
          autoComplete="off"
          maxLength={80}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try notes…"
        />
      </Field>
      {visible.length ? (
        <ul>
          {visible.map((file) => (
            <li key={file.name}>
              <button onClick={() => setPreview(file.content)}>
                <span className="file-icon" aria-hidden="true">
                  ▤
                </span>
                <span>
                  <strong>{file.name}</strong>
                  <small>{file.type}</small>
                </span>
                <span className="product-meta">{file.size}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="No files match">
          <p>Clear the filter to see the studio collection.</p>
        </Empty>
      )}
      <p role="status" className="file-preview">
        {preview}
      </p>
    </div>
  );
}
