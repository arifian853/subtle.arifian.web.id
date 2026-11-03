import { Tabs as Primitive } from "@base-ui/react/tabs";
import { cn } from "../../lib/utils";
export const Tabs = Primitive.Root;
export const TabsContent = Primitive.Panel;
export function TabsList({ className, ...props }: Primitive.List.Props) {
  return <Primitive.List className={cn("tabs-list", className)} {...props} />;
}
export function TabsTrigger({ className, ...props }: Primitive.Tab.Props) {
  return <Primitive.Tab className={cn("tabs-trigger", className)} {...props} />;
}
