import { useEffect, useId, useRef, useState } from "react";
import { nestedRadius } from "../lib/shape";
import { Button } from "./ui/button";

export function RadiusDemo() {
  const id = useId();
  const [inset, setInset] = useState(8);
  const [closed, setClosed] = useState(false);
  const action = useRef<HTMLButtonElement>(null);
  const interacted = useRef(false);
  useEffect(() => {
    if (interacted.current) action.current?.focus();
  }, [closed]);
  const outer = 24;
  const inner = nestedRadius(outer, inset);
  return (
    <div className="radius-demo">
      <div className="radius-controls">
        <label htmlFor={id}>Inset / padding: {inset} px</label>
        <input
          id={id}
          type="range"
          min="4"
          max="24"
          step="4"
          value={inset}
          onChange={(event) => setInset(Number(event.target.value))}
        />
        <output htmlFor={id}>
          Outer {outer} px − inset {inset} px = inner {inner} px
        </output>
        <p>
          Both corners are measured from the same edge. A border counts toward
          the inset.
        </p>
      </div>
      <div
        className="radius-outer"
        style={{ borderRadius: outer, padding: inset }}
      >
        <div className="radius-inner" style={{ borderRadius: inner }}>
          {closed ? (
            <Button
              ref={action}
              variant="secondary"
              onClick={() => setClosed(false)}
            >
              Restore preview
            </Button>
          ) : (
            <>
              <Button
                ref={action}
                size="icon"
                variant="ghost"
                aria-label="Close corner preview"
                onClick={() => {
                  interacted.current = true;
                  setClosed(true);
                }}
              >
                ×
              </Button>
              <h3>Space follows the corner.</h3>
              <p>
                The close control keeps a 44 px target inside the inset.
                Changing padding makes the inner curve step down.
              </p>
            </>
          )}
        </div>
      </div>
      <p role="status" className="sr-only">
        {closed
          ? "Corner preview closed."
          : `Corner preview open. Inner radius ${inner} pixels.`}
      </p>
    </div>
  );
}
