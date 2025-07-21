import { useState } from "react";
import "./currency.css";

export default function CurrencyDropdown({
  selectedCurrency,
  onCurrencyChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: "Rs", name: "Sri Lankan Rupees", symbol: "Rs.", rate: 1 },
    { code: "USD", name: "US Dollar", symbol: "$", rate: 0.0036 },
    { code: "EUR", name: "Euro", symbol: "€", rate: 0.0033 },
    { code: "GBP", name: "British Pound", symbol: "£", rate: 0.0028 },
    { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 0.3 },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", rate: 0.013 },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 0.013 },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectCurrency = (currency) => {
    onCurrencyChange(currency);
    setIsOpen(false);
  };

  const currentCurrency =
    currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  return (
    <div className="currency-dropdown">
      <div className="currency-header">
        <span className="currency-label">
          Currency {currentCurrency.symbol}
        </span>
        <img
          src="/images/drop-down.png"
          alt="Dropdown Icon"
          className={`dropdown-icon ${isOpen ? "rotated" : ""}`}
          onClick={toggleDropdown}
        />
      </div>

      {isOpen && (
        <div className="currency-list">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              onClick={() => selectCurrency(currency)}
              className="currency-item"
            >
              {currency.name} ({currency.symbol})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
