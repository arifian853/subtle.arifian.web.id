import { useId, useSyncExternalStore } from "react";
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
export function MoodSwitcher() {
  const name = useId();
  const current = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "beige" as MoodId,
  );
  return (
    <fieldset className="mood-options">
      <legend>Choose your mood</legend>
      {moodOrder.map((id) => (
        <label className="mood-option" key={id}>
          <input
            type="radio"
            name={name}
            value={id}
            checked={current === id}
            onChange={() => chooseMood(id)}
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
