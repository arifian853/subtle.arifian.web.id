import { useId, useRef, useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import { Field, FieldLabel, Textarea } from "./ui/field";
type ChatMessage = { speaker: "You" | "Subtle"; text: string; id: number };
function MessageScroller({ children }: { children: ReactNode }) {
  return (
    <div
      className="message-scroller"
      role="log"
      aria-label="Synthetic conversation"
      aria-live="polite"
      aria-relevant="additions"
    >
      {children}
    </div>
  );
}
function Message({ speaker, text }: ChatMessage) {
  return (
    <article className="message" data-speaker={speaker}>
      <span className="message-avatar" aria-hidden="true">
        {speaker === "Subtle" ? "✳" : "Y"}
      </span>
      <div>
        <p className="message-speaker">{speaker}</p>
        <div className="bubble">{text}</div>
      </div>
    </article>
  );
}
export function Conversation() {
  const id = useId();
  const nextId = useRef(1);
  const field = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      speaker: "Subtle",
      text: "Good design leaves room to think. What are you working on?",
    },
  ]);
  return (
    <div className="conversation">
      <div className="conversation-header">
        <h3>A space to think.</h3>
        <span className="context-capsule">Local demo</span>
      </div>
      <MessageScroller>
        {messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
      </MessageScroller>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const value = text.trim().slice(0, 500);
          if (!value) {
            setError("Write a message before sending.");
            field.current?.focus();
            return;
          }
          setError("");
          setMessages((previous) => [
            ...previous.slice(-3),
            { id: nextId.current++, speaker: "You", text: value },
            {
              id: nextId.current++,
              speaker: "Subtle",
              text: "Start with a tonal surface to group the task. Give the surrounding story room to breathe. This is a prepared reply in a local demo.",
            },
          ]);
          setText("");
          field.current?.focus();
        }}
      >
        <Field data-invalid={error ? "" : undefined}>
          <FieldLabel htmlFor={`${id}-message`}>Message</FieldLabel>
          <Textarea
            ref={field}
            id={`${id}-message`}
            name="message"
            autoComplete="off"
            maxLength={500}
            rows={2}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What are you working on?…"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          {error && (
            <p className="field-error" role="alert" id={`${id}-error`}>
              {error}
            </p>
          )}
        </Field>
        <div className="composer-actions">
          <span className="product-meta">
            Synthetic conversation. No model connected.
          </span>
          <Button type="submit" size="icon" aria-label="Send message">
            <span aria-hidden="true">↑</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
