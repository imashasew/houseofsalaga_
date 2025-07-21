export default function CardIcons() {
  return (
    <span style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 8 }}>
      {/* Mastercard */}
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><circle cx="10" cy="10" r="8" fill="#EB001B"/><circle cx="22" cy="10" r="8" fill="#F79E1B"/><circle cx="16" cy="10" r="8" fill="#FF5F00" fillOpacity=".7"/></svg>
      {/* Visa */}
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="4" fill="#fff"/><text x="6" y="15" fontSize="11" fontWeight="bold" fill="#1A1F71">VISA</text></svg>
      {/* PayPal */}
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="4" fill="#fff"/><text x="4" y="15" fontSize="11" fontWeight="bold" fill="#003087">Pay</text><text x="18" y="15" fontSize="11" fontWeight="bold" fill="#009cde">Pal</text></svg>
    </span>
  );
} 