import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../lib/utils";
export function Badge({
  children,
  variant = "success",
}: {
  children: ReactNode;
  variant?: "success" | "pending" | "error";
}) {
  return <span className={cn("status", variant)}>{children}</span>;
}
export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress">
      <div>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <progress value={value} max={100} aria-label={label}>
        {value}%
      </progress>
    </div>
  );
}
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden="true" className={cn("skeleton", className)} {...props} />
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty-state" role="status">
      <span aria-hidden="true">⊞</span>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
