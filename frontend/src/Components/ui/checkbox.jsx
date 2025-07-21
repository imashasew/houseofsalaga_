import { useState } from "react";
import { Check } from "lucide-react";
import "./checkbox.css";

export function Checkbox({ defaultChecked = false, className = "", ...props }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
      <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          className={`checkbox-base ${checked ? "checkbox-checked" : "checkbox-unchecked"} ${className}`}
          onClick={() => setChecked(!checked)}
          {...props}
      >
        {checked && <Check className="checkbox-icon" />}
      </button>
  );
}