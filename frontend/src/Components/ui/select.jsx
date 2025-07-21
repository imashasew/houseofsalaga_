import { useState } from "react";
import "./select.css"; // Import the new CSS file

export function Select({ children, defaultValue, onValueChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
      <div className="select-container">
        {children({ isOpen, selectedValue, handleSelect, setIsOpen })}
      </div>
  );
}

export function SelectTrigger({ children, className = "" }) {
  return (
      <button
          className={`select-trigger ${className}`}
      >
        {children}
      </button>
  );
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children }) {
  return (
      <div className="select-content">
        {children}
      </div>
  );
}

export function SelectItem({ value, children, onSelect }) {
  return (
      <div
          className="select-item"
          onClick={() => onSelect && onSelect(value)}
      >
        {children}
      </div>
  );
}