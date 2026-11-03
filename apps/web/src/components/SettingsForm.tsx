import { useId, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel, Input, NativeSelect } from "./ui/field";

export function SettingsForm() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const name = String(form.get("workspace") ?? "").trim();
        if (!name) {
          setError("Enter a workspace name to save your changes.");
          setSaved("");
          input.current?.focus();
          return;
        }
        setError("");
        setSaved(`${name} saved. This change stays in the demo.`);
      }}
    >
      <FieldGroup>
        <Field data-invalid={error ? "" : undefined}>
          <FieldLabel htmlFor={`${id}-name`}>Workspace name</FieldLabel>
          <Input
            ref={input}
            id={`${id}-name`}
            name="workspace"
            autoComplete="off"
            defaultValue="Fieldnotes studio"
            maxLength={80}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          {error && (
            <p role="alert" id={`${id}-error`} className="field-error">
              {error}
            </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-type`}>Workspace type</FieldLabel>
          <NativeSelect id={`${id}-type`} name="type" defaultValue="team">
            <option value="team">Team studio</option>
            <option value="personal">Personal collection</option>
            <option value="research">Research space</option>
          </NativeSelect>
        </Field>
        <Field>
          <label className="checkbox-label">
            <input name="summary" type="checkbox" defaultChecked />
            Weekly summary
          </label>
        </Field>
        <Button type="submit">Save workspace</Button>
        <p role="status" className="form-status">
          {saved}
        </p>
      </FieldGroup>
    </form>
  );
}
