import { MoodPicker } from "./MoodPicker";
export { chooseMood } from "./MoodPicker";
/** Backwards-compatible site adapter for the reusable MoodPicker. */
export function MoodSwitcher() {
  return <MoodPicker />;
}
