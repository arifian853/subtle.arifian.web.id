import { useState } from "react";
import { Button } from "./ui/button";
export function MotionDemo() {
  const [replay, setReplay] = useState(0);
  return (
    <div className="motion-demo">
      <div
        key={replay}
        className="motion-art"
        data-replay={replay}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
      <div className="motion-controls">
        <span className="mono">200 ms / soft ease-out</span>
        <Button variant="ghost" onClick={() => setReplay((value) => value + 1)}>
          Replay transition <span aria-hidden="true">↻</span>
        </Button>
      </div>
      <span role="status" className="sr-only">
        {replay
          ? "Transition replayed. Reduced motion keeps the same visible state."
          : "Ready to replay."}
      </span>
    </div>
  );
}
