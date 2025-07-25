// src/components/ui/label.tsx
import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  return (
    <label
      ref={ref}
      className="block text-sm font-medium text-gray-700 mb-1"
      {...props}
    />
  );
});

Label.displayName = "Label";
export { Label };
