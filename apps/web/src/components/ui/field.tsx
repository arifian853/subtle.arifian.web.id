import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
export function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("field-group", className)} {...props} />;
}
export function Field({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("field", className)} {...props} />;
}
export function FieldLabel(props: ComponentProps<"label">) {
  return <label {...props} />;
}
export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn("input", className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn("input textarea", className)} {...props} />;
}
export function NativeSelect({
  className,
  ...props
}: ComponentProps<"select">) {
  return <select className={cn("input", className)} {...props} />;
}
