import { useState } from "react";
import { Toast } from "@base-ui/react/toast";
import { Button } from "./ui/button";
import { Empty, Progress, Skeleton } from "./ui/feedback";
function FeedbackContent() {
  const [loading, setLoading] = useState(false);
  const manager = Toast.useToastManager();
  return (
    <div className="feedback-demo">
      <h3>Make the state clear.</h3>
      <Progress value={loading ? 24 : 84} label="Collection progress" />
      <div role="status" aria-label="Content state" className="product-meta">
        {loading ? "Loading collection…" : "Ready to explore."}
      </div>
      {loading ? (
        <div className="skeleton-group">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <Empty title="A fresh collection">
          <p>Add your first note to make this space your own.</p>
        </Empty>
      )}
      <div className="actions">
        <Button
          variant="secondary"
          onClick={() => setLoading((value) => !value)}
        >
          {loading ? "Show content" : "Preview loading"}
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            manager.add({
              id: "demo-feedback",
              title: "A little feedback. Your local action is complete.",
              priority: "low",
            })
          }
        >
          Show toast
        </Button>
      </div>
      <Toast.Portal>
        <Toast.Viewport className="toast-viewport">
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast} className="toast">
              <Toast.Content>
                <Toast.Title />
                <Toast.Close
                  className="button ghost icon"
                  aria-label="Dismiss notification"
                >
                  ×
                </Toast.Close>
              </Toast.Content>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </div>
  );
}
export function FeedbackDemo() {
  return (
    <Toast.Provider limit={1} timeout={0}>
      <FeedbackContent />
    </Toast.Provider>
  );
}
