import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import "./shop-header.css";
import Breadcrumb from "../../Components/breadcrumb";

export default function Header({ onApplyEdits }) {
  const [selectedSort, setSelectedSort] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    "Most Popular",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
  ];

  const handleSortChange = (option) => {
    setSelectedSort(option);
    setIsDropdownOpen(false);
    onApplyEdits({ sort: option });
  };

  return (
    <div className="shop-header-container">
      <div className="shop-header-wrapper">
        <div className="shop-header-inner">
          <Breadcrumb paths={["Home", "Shop"]} />
          <div className="title-sort-container">
            <h1 className="product-count">Showing 1-10 of 100 Products</h1>

            <div className="sort-section">
              <span className="sort-label">Sort by:</span>
              <div className="dropdown-wrapper">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="dropdown-toggle"
                >
                  <span className="dropdown-value">
                    {selectedSort || "Select"}
                  </span>
                  <ChevronDown className="dropdown-icon" />
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className="dropdown-item"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
