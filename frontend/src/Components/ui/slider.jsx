import { useState } from "react";
import "./slider.css"; // Import the new CSS file

export function Slider({
                         value = [0, 100],
                         onValueChange,
                         min = 0,
                         max = 100,
                         step = 1,
                         className = "",
                       }) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(val);
    if (onValueChange) onValueChange([val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(val);
    if (onValueChange) onValueChange([minVal, val]);
  };

  return (
      <div className={`slider-wrapper ${className}`}>
        <div className="slider-track">
          {/* Selected range highlight */}
          <div
              className="slider-range"
              style={{
                left: `${((minVal - min) / (max - min)) * 100}%`,
                width: `${((maxVal - minVal) / (max - min)) * 100}%`,
              }}
          ></div>

          {/* Min range input */}
          <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={minVal}
              onChange={handleMinChange}
              className="slider-input"
              style={{ zIndex: minVal > max - 10 ? "5" : "3" }}
          />

          {/* Max range input */}
          <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={maxVal}
              onChange={handleMaxChange}
              className="slider-input"
              style={{ zIndex: "4" }}
          />
        </div>

        {/* Price Range Display */}
        <div className="slider-price-display">
          <span>Min: {minVal}</span>
          <span>Max: {maxVal}</span>
        </div>
      </div>
  );
}