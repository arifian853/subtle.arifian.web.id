import { useState, type CSSProperties } from "react";
import { moodOrder, moods } from "@subtle/catalog";
import { Scrollbar } from "./ui/scrollbar";
import { Button } from "./ui/button";

export function MoodBoards() {
  const [message, setMessage] = useState("");
  async function copy(name: string, token: string, value: string) {
    try {
      await navigator.clipboard.writeText(`${token}: ${value};`);
      setMessage(`Copied ${name} ${token}`);
    } catch {
      setMessage(
        `Copy failed. Select the visible ${name} ${token} declaration and copy it manually.`,
      );
    }
  }
  return (
    <div className="mood-boards">
      <p role="status" aria-atomic="true" className="copy-status">
        {message || "Copy a declaration from any swatch."}
      </p>
      {moodOrder.map((id) => (
        <section key={id} id={id} className="mood-board-section">
          <header>
            <h2>{moods[id].name}</h2>
            <p>{moods[id].description}</p>
            <p className="product-meta">
              {moods[id].dark ? "Native dark" : "Native light"}
              {id === "beige" ? " / Default" : ""}
            </p>
          </header>
          {id === "rosewood" && (
            <p className="reference-note">
              Use --text-subtle-readable and --status-available-text-aa for the
              documented readability corrections. Canonical values remain
              available.
            </p>
          )}
          <Scrollbar
            label={`${moods[id].name} token board`}
            className="token-board"
          >
            <div className="token-swatches">
              {Object.entries(moods[id].tokens).map(([token, value]) => (
                <div className="token-swatch" key={token}>
                  <div
                    className="token-color"
                    style={{ backgroundColor: value } as CSSProperties}
                    aria-hidden="true"
                  />
                  <div className="token-caption">
                    <code>
                      {token}: {value};
                    </code>
                    <Button
                      variant="ghost"
                      onClick={() => copy(moods[id].name, token, value)}
                      aria-label={`Copy ${moods[id].name} ${token}`}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Scrollbar>
        </section>
      ))}
      <section className="mood-coming">
        <h2>Coming soon</h2>
        <p>
          More atmosphere studies are on the way. The canonical collection
          remains eight moods.
        </p>
      </section>
    </div>
  );
}
