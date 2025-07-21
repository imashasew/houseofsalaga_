import { useState } from "react";
import "./filter-sidebar.css";

import { Checkbox } from "../../Components/ui/checkbox";
import { Slider } from "../../Components/ui/slider";
import { SlidersHorizontal, ChevronUp } from "lucide-react";

export default function FilterSidebar({ onApplyFilter }) {
  const [priceRange, setPriceRange] = useState([500, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const colorOptions = [
    { name: "Green", class: "bg-green-500" },
    { name: "Red", class: "bg-red-500" },
    { name: "Orange", class: "bg-orange-500" },
    { name: "Yellow", class: "bg-yellow-400" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Pink", class: "bg-pink-500" },
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white border-gray-300" },
    { name: "Cyan", class: "bg-cyan-500" },
  ];

  const handleApply = () => {
    const appliedFilters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      category: selectedCategories,
      size: selectedSizes,
      colors: selectedColors,
    };
    console.log("Applied filters:", appliedFilters);
    onApplyFilter(appliedFilters);
  };

  const handleClear = () => {
    setPriceRange([500, 10000]);
    setSelectedCategories("");
    setSelectedSizes("");
    setSelectedColors([]);
    onApplyFilter({
      minPrice: 500,
      maxPrice: 10000,
      category: "",
      size: "",
      colors: [],
    });
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2>FILTERS</h2>
        <div className="flex items-center gap-2">
          <SlidersHorizontal />
          <button className="clear-btn" onClick={handleClear}>
            Clear All
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="filter-section">
        <h3 className="section-title">PRICES</h3>
        <div className="range-display">
          <span>Range</span>
          <span>
            Rs.{priceRange[0]} - Rs.{priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          min={500}
          step={500}
        />
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h3 className="section-title">CATEGORIES</h3>
        {["Women", "Ladies", "Men", "Kids"].map((cat) => (
          <div key={cat} className="flex items-center gap-2 mb-2">
            <Checkbox
              id={cat.toLowerCase().replace(" ", "-")}
              checked={selectedCategories.includes(cat)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedCategories((prev) => [...prev, cat]);
                } else {
                  setSelectedCategories((prev) =>
                    prev.filter((c) => c !== cat)
                  );
                }
              }}
            />
            <label htmlFor={cat.toLowerCase()} className="section-label">
              {cat}
            </label>
          </div>
        ))}
      </div>

      {/* Sizes */}
      <div className="filter-section">
        <h3 className="section-title">SIZE</h3>
        {["Small", "Medium", "Large", "Extra Large"].map((size) => (
          <div key={size} className="flex items-center gap-2 mb-2">
            <Checkbox
              id={size.toLowerCase().replace(" ", "-")}
              checked={selectedSizes.includes(size)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedSizes((prev) => [...prev, size]);
                } else {
                  setSelectedSizes((prev) => prev.filter((s) => s !== size));
                }
              }}
            />
            <label htmlFor={size.toLowerCase()} className="section-label">
              {size}
            </label>
          </div>
        ))}
      </div>

      {/* Colors */}
      <div className="filter-section">
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">Colors</h3>
          <ChevronUp size={16} />
        </div>
        <div className="filter-grid">
          {colorOptions.map((color) => (
            <button
              key={color.name}
              title={color.name}
              className={`color-button ${color.class} ${
                selectedColors.includes(color.name) ? "color-selected" : ""
              }`}
              onClick={() => toggleColor(color.name)}
            >
              {selectedColors.includes(color.name) && (
                <span className="color-tick">✓</span>
              )}
            </button>
          ))}
        </div>
        {selectedColors.length > 0 && (
          <div className="selected-text">
            Selected: {selectedColors.join(", ")}
          </div>
        )}
      </div>

      {/* Apply Filter */}
      <button onClick={handleApply} className="apply-btn">
        Apply Filter
      </button>


    </div>
  );
}
