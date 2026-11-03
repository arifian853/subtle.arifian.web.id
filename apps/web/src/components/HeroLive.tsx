import { useState } from "react";
import { Button } from "./ui/button";
import { Badge, Progress } from "./ui/feedback";
export function HeroLive() {
  const [complete, setComplete] = useState(false);
  return (
    <div className="hero-task">
      <div className="hero-task-top">
        <span className="product-meta">Your studio, at a glance</span>
        <Badge>{complete ? "Complete" : "In good shape"}</Badge>
      </div>
      <h3>Everyday objects</h3>
      <Progress value={complete ? 100 : 84} label="Collection progress" />
      <div className="hero-task-bottom">
        <div
          className="avatar-stack"
          aria-label="Three synthetic collaborators"
        >
          <span>A</span>
          <span>N</span>
          <span>R</span>
        </div>
        <Button
          variant="secondary"
          onClick={() => setComplete((value) => !value)}
        >
          {complete ? "Reopen task" : "Mark complete"}
          <span aria-hidden="true">{complete ? "↻" : "✓"}</span>
        </Button>
      </div>
      <span className="sr-only" role="status">
        {complete
          ? "Complete. Collection progress 100%."
          : "In review. Collection progress 84%."}
      </span>
    </div>
  );
}
