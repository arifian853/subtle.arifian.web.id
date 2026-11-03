import { Dialog as Primitive } from "@base-ui/react/dialog";
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";
export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogTitle = Primitive.Title;
export const DialogDescription = Primitive.Description;
export const DialogClose = Primitive.Close;
export function DialogContent({
  children,
  variant = "dialog",
  className,
  ...props
}: Primitive.Popup.Props & {
  variant?: "dialog" | "sheet";
  children?: ReactNode;
}) {
  return (
    <Primitive.Portal>
      <Primitive.Backdrop className="overlay-backdrop" />
      <Primitive.Viewport
        className={cn(
          "overlay-viewport",
          variant === "sheet" && "sheet-viewport",
        )}
      >
        <Primitive.Popup
          className={cn("overlay-panel", variant, className)}
          {...props}
        >
          {children}
          <Primitive.Close
            className="button ghost icon overlay-close"
            aria-label="Close panel"
          >
            <span aria-hidden="true">×</span>
          </Primitive.Close>
        </Primitive.Popup>
      </Primitive.Viewport>
    </Primitive.Portal>
  );
}
