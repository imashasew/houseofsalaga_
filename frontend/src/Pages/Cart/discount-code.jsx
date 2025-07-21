import { useState } from "react";
import { Tag, ChevronDown, X } from "lucide-react";
import "./discount-code.css";

export default function DiscountCodeInput({ onApplyDiscount, loading }) {
  const [discountCode, setDiscountCode] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  const availableCodes = [
    { code: "SAVE10", description: "10% off (Min: Rs.1,000)" },
    { code: "FLAT500", description: "Rs.500 off (Min: Rs.2,000)" },
    { code: "WELCOME20", description: "20% off (Min: Rs.1,500)" },
  ];

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    const result = await onApplyDiscount(discountCode);
    setDiscountMessage(result.message);

    if (result.success) {
      setDiscountCode("");
      setIsDiscountApplied(true);
      setTimeout(() => setDiscountMessage(""), 3000);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountMessage("Discount removed.");
    setIsDiscountApplied(false);
    setTimeout(() => setDiscountMessage(""), 3000);
  };

  const selectCode = (code) => {
    setDiscountCode(code);
    setShowDropdown(false);
  };

  return (
    <div className="discount-input-wrapper">
      <form onSubmit={handleApplyDiscount} className="discount-form">
        <div className="discount-input-container">
          <div className="discount-input-box">
            <Tag className="discount-icon" />
            <input
              type="text"
              placeholder="Add discount code"
              className="discount-input"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={loading || isDiscountApplied}
            />
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="dropdown-toggle"
              disabled={isDiscountApplied}
            >
              <ChevronDown className="dropdown-icon" />
            </button>
          </div>

          {showDropdown && (
            <div className="discount-dropdown">
              <div className="dropdown-header">Available Codes:</div>
              {availableCodes.map((item) => (
                <div
                  key={item.code}
                  onClick={() => selectCode(item.code)}
                  className="dropdown-item"
                >
                  <div className="dropdown-code">{item.code}</div>
                  <div className="dropdown-description">{item.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isDiscountApplied ? (
          <button
            type="button"
            onClick={handleRemoveDiscount}
            className="btn-remove"
          >
            <X className="remove-icon" />
            Remove
          </button>
        ) : (
          <button
            type="submit"
            className="btn-apply"
            disabled={loading || !discountCode.trim()}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        )}
      </form>



      {discountMessage && (
        <div
          className={`discount-message ${
            discountMessage.includes("successfully") ? "success" : "error"
          }`}
        >
          {discountMessage}
        </div>
      )}
    </div>
  );
}
