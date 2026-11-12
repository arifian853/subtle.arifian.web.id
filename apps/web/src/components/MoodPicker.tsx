import { useId, useRef, useState, useSyncExternalStore } from "react";
import { moods, moodOrder, isMood, type MoodId } from "@subtle/catalog/tokens";

const subscribe = (notify: () => void) => {
  window.addEventListener("subtle:mood", notify);
  return () => window.removeEventListener("subtle:mood", notify);
};
const snapshot = () =>
  isMood(document.documentElement.dataset.mood)
    ? (document.documentElement.dataset.mood as MoodId)
    : "beige";
export function chooseMood(id: MoodId) {
  document.documentElement.dataset.mood = id;
  document.documentElement.style.colorScheme = moods[id].dark
    ? "dark"
    : "light";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", moods[id].tokens["--bg-main"]);
  try {
    localStorage.setItem("subtle:mood:v1", id);
  } catch {
    /* Selection remains usable without storage. */
  }
  window.dispatchEvent(new Event("subtle:mood"));
}
export function MoodPicker({
  value,
  onValueChange,
  label = "Choose your mood",
}: {
  value?: MoodId;
  onValueChange?: (value: MoodId) => void;
  label?: string;
}) {
  const name = useId();
  const documentMood = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "beige" as MoodId,
  );
  const current = value ?? documentMood;
  return (
    <fieldset className="mood-options">
      <legend>{label}</legend>
      {moodOrder.map((id) => (
        <label className="mood-option" key={id}>
          <input
            type="radio"
            name={name}
            value={id}
            checked={current === id}
            onChange={() => (onValueChange ?? chooseMood)(id)}
          />
          <span
            className="mood-swatch"
            style={{
              backgroundColor: moods[id].tokens["--primary"],
              color: moods[id].tokens["--bg-main"],
            }}
          >
            <span className="mood-check" aria-hidden="true">
              ✓
            </span>
          </span>
          <span>{moods[id].name}</span>
        </label>
      ))}
      <span className="sr-only" role="status">
        {moods[current].name} mood selected
      </span>
    </fieldset>
  );
}

export function CompactMoodPicker({
  label = "Appearance",
}: {
  label?: string;
}) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const current = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "beige" as MoodId,
  );

  return (
    <div className="compact-mood-picker">
      <button
        type="button"
        ref={triggerRef}
        className="compact-mood-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
          <path d="M10 2.2a7.8 7.8 0 1 0 0 15.6h1.2a2.1 2.1 0 0 0 1.6-3.5 1.4 1.4 0 0 1 1.1-2.3h1.2A2.7 2.7 0 0 0 17.8 9c-.5-3.9-3.8-6.8-7.8-6.8Z" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="6.2" cy="8" r="1" fill="currentColor" />
          <circle cx="9.8" cy="5.8" r="1" fill="currentColor" />
          <circle cx="13.3" cy="7.3" r="1" fill="currentColor" />
        </svg>
        <span>{label}</span>
        <span className="compact-mood-current">{moods[current].name}</span>
      </button>
      {open && (
        <div
          className="compact-mood-panel"
          id={panelId}
          hidden={!open}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <MoodPicker
            label="Choose a mood"
            onValueChange={(id) => {
              chooseMood(id);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
