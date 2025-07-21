import "./cart-quantity.css";

export default function CartItemQuantity({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
}) {
  return (
    <div className="quantity-container">
      <button onClick={onDecrease} className="quantity-btn" disabled={disabled}>
        -
      </button>
      <span className="quantity-value">{quantity}</span>
      <button onClick={onIncrease} className="quantity-btn" disabled={disabled}>
        +
      </button>
    </div>
  );
}
