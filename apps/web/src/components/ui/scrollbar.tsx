import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

/** Native overflow retains browser keyboard, wheel, touch and assistive navigation. */
export function Scrollbar({
  label,
  className,
  ...props
}: ComponentProps<"div"> & { label: string }) {
  return (
    <div
      {...props}
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn("scrollbar scroll-region", className)}
    />
  );
}
