import { Select as Primitive } from "@base-ui/react/select";
import { useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface SelectProps {
  label: string;
  id?: string;
  name?: string;
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
}
/** Owned presentation; Base UI owns keyboard/typeahead, touch, dismissal and focus. */
export function Select({
  label,
  id,
  options,
  onValueChange,
  ...props
}: SelectProps) {
  const generated = useId();
  const triggerId = id ?? generated;
  return (
    <Primitive.Root
      {...props}
      items={options}
      onValueChange={(value) => {
        if (value !== null) onValueChange?.(value);
      }}
    >
      <Primitive.Trigger
        id={triggerId}
        aria-label={label}
        className="input select-trigger"
      >
        <Primitive.Value />
        <Primitive.Icon aria-hidden="true" className="select-chevron">
          <svg viewBox="0 0 16 16" fill="none" focusable="false">
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Primitive.Icon>
      </Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Positioner
          sideOffset={8}
          alignItemWithTrigger={false}
          className="select-positioner"
        >
          <Primitive.Popup
            className="select-popup"
            aria-label={label}
          >
            <Primitive.Group>
              {options.map((option) => (
                <Primitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="select-option"
                >
                  <Primitive.ItemText>{option.label}</Primitive.ItemText>
                  <Primitive.ItemIndicator aria-hidden="true">
                    ✓
                  </Primitive.ItemIndicator>
                </Primitive.Item>
              ))}
            </Primitive.Group>
          </Primitive.Popup>
        </Primitive.Positioner>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
