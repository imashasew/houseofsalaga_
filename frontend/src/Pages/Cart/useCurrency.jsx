import { useState, useCallback, useMemo } from "react"; // ✅ ADDED: useMemo import

export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("Rs");

  //
  const exchangeRates = useMemo(
    () => ({
      Rs: { rate: 1, symbol: "Rs.", name: "Sri Lankan Rupees" },
      USD: { rate: 0.0036, symbol: "$", name: "US Dollar" },
      EUR: { rate: 0.0033, symbol: "€", name: "Euro" },
      GBP: { rate: 0.0028, symbol: "£", name: "British Pound" },
      INR: { rate: 0.3, symbol: "₹", name: "Indian Rupee" },
      AED: { rate: 0.013, symbol: "د.إ", name: "UAE Dirham" },
      SAR: { rate: 0.013, symbol: "﷼", name: "Saudi Riyal" },
    }),
    []
  );

  // Convert price from base currency to selected currency
  const convertPrice = useCallback(
    (priceInBase) => {
      const rate = exchangeRates[selectedCurrency]?.rate || 1;
      return priceInBase * rate;
    },
    [selectedCurrency, exchangeRates]
  );

  // Format price with currency symbol
  const formatPrice = useCallback(
    (priceInBase) => {
      const convertedPrice = convertPrice(priceInBase);
      const currencyInfo = exchangeRates[selectedCurrency];

      // Format based on currency
      if (selectedCurrency === "Rs") {
        return `${currencyInfo.symbol}${convertedPrice.toLocaleString(
          "en-IN"
        )}.00`;
      } else {
        return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
      }
    },
    [selectedCurrency, convertPrice, exchangeRates]
  );

  // Handle currency change
  const handleCurrencyChange = useCallback((currency) => {
    setSelectedCurrency(currency.code);
  }, []); //
  return {
    selectedCurrency,
    handleCurrencyChange,
    convertPrice,
    formatPrice,
    currencySymbol: exchangeRates[selectedCurrency]?.symbol || "Rs.",
    currencyName: exchangeRates[selectedCurrency]?.name || "Sri Lankan Rupees",
  };
};
