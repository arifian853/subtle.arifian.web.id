import { moods } from "@subtle/catalog/tokens";

// This script runs synchronously in <head>, before the body and first paint.
export const moodBootScript = `(() => {
  const moods = ${JSON.stringify(moods)};
  let mood = 'beige';
  try { const saved = localStorage.getItem('subtle:mood:v1'); if (saved && Object.hasOwn(moods, saved)) mood = saved; } catch {}
  const root = document.documentElement;
  root.dataset.mood = mood;
  root.style.colorScheme = moods[mood].dark ? 'dark' : 'light';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = moods[mood].tokens['--bg-main'];
})();`;
