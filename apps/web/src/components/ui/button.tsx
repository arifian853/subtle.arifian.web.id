import { Button as Primitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
const variants = cva("button", {
  variants: {
    variant: {
      primary: "primary",
      secondary: "secondary",
      outline: "outline",
      ghost: "ghost",
      destructive: "destructive",
    },
    size: { default: "", icon: "icon" },
  },
  defaultVariants: { variant: "primary", size: "default" },
});
export function Button({
  className,
  variant,
  size,
  ...props
}: Primitive.Props & VariantProps<typeof variants>) {
  return (
    <Primitive
      className={cn(variants({ variant, size }), className)}
      {...props}
    />
  );
}
